
import os
from flask import Flask, request
import logging
import sys
import datetime
from konlpy.tag import Komoran
from textrank import KeysentenceSummarizer
import numpy as np
import kss

def log(msg):
    curtime = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    print("\x1b[32m[Main Sentence Extraction Server, {}]\x1b[0m {}".format(curtime, msg))

app = Flask(__name__)

# Turn off flask default log
app.logger.disable = True
logging.getLogger("werkzeug").disabled = True
sys.modules["flask.cli"].show_server_banner = lambda *x: None

def subword_tokenizer(sent, n=3):
    def subword(token, n):
        if len(token) <= n:
            return [token]

        return [token[i:i+n] for i in range(len(token) - n + 1)]

    return [sub for token in sent.split() for sub in subword(token, n)]

def komoran_tokenizer(sent):
    words = komoran.pos(sent, join=True)
    words = [w for w in words if ('/NN' in w or '/XR' in w or '/VA' in w or '/VV' in w)]
    return words

def getSentenceList(rawText):
    sentences = [x for x in rawText.split("\n") if x]
    del sentences[0]  # 첫 문장(제목) 제거
    return sentences

komoran = Komoran()

komoran_tokenizer_summarizer = KeysentenceSummarizer(
    tokenize=komoran_tokenizer,
    min_sim=0.3,
    verbose=False
)

subword_tokenizer_summarizer = KeysentenceSummarizer(
    tokenize=subword_tokenizer,
    min_sim=0.3
)

@app.route("/", methods=['POST'])
def extract():
    def append_prev_next_sent(full_sent_texts, sent_idx):
        result = ""
        
        if sent_idx > 0:
            result += full_sent_texts[sent_idx - 1] + "\n"
            
        result += full_sent_texts[sent_idx]

        if sent_idx < len(full_sent_texts) - 1:
            result += "\n" + full_sent_texts[sent_idx + 1]
        
        return result

    json = request.get_json()
    main_sentence_num = int(json["main_sentence_num"])
    text = json["text"]
    version = json["main_sentence_model_ver"]

    sentences = getSentenceList(text)

    if version == "v1.0.0":  # komoran_tokenizer
        summarize_result = komoran_tokenizer_summarizer.summarize(sentences, topk=main_sentence_num + 3)
    elif version == "v2.0.0":  # subword_tokenizer
        summarize_result = subword_tokenizer_summarizer.summarize(sentences, topk=main_sentence_num + 3)
    elif version == "current":
        komoran_summarize_result = komoran_tokenizer_summarizer.summarize(sentences, topk=main_sentence_num + 3)
        subword_summarize_result = subword_tokenizer_summarizer.summarize(sentences, topk=main_sentence_num + 3)
        summarize_result = sorted(komoran_summarize_result + subword_summarize_result, key=lambda x:x[1])  # sort by rank

    appeared_sent_idx = []
    main_sentences = []
    for sent_idx, sent_rank, _ in summarize_result:
        if len(appeared_sent_idx) == main_sentence_num:  # 필요한 개수 다 채우면 종료
            break
        
        if sent_idx in appeared_sent_idx:  # 이미 등장한 idx는 skip
            continue

        main_sentences.append({
            "idx": int(sent_idx),
            "rank": sent_rank,
            "sentence": append_prev_next_sent(sentences, sent_idx)
        })

        appeared_sent_idx.append(sent_idx - 1)
        appeared_sent_idx.append(sent_idx)
        appeared_sent_idx.append(sent_idx + 1)
    
    log([{"rank":float("{:.4f}".format(x["rank"])), "sentence":(x["sentence"][:20] + "...")} for x in main_sentences])
    return {"main_sentences": main_sentences}, 200

if __name__ == "__main__":
    host = "127.0.0.1"
    port = "9003"
    
    log("Listening at http://{}:{}".format(host, port))
    app.run(host=host, port=port)
    