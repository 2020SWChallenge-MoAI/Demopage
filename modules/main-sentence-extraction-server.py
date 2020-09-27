
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
    sentences = []
    for sentence in kss.split_sentences(rawText):
        sentences.append(sentence)

    sentences = [x for x in sentences if x]  # 빈 문장 제거
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
    json = request.get_json()
    main_sentence_num = int(json["main_sentence_num"])
    text = json["text"]
    version = json["main_sentence_model_ver"]

    sentences = getSentenceList(text)

    if version == "v1.0.0":  # komoran_tokenizer
        summarize_result = komoran_tokenizer_summarizer.summarize(sentences, topk=main_sentence_num)
    elif version == "v2.0.0":  # subword_tokenizer
        summarize_result = subword_tokenizer_summarizer.summarize(sentences, topk=main_sentence_num)

    main_sentences = []
    for _, rank, sentence in summarize_result:
        main_sentences.append({
            "rank": rank,
            "sentence": sentence
        })
    
    log([{"rank":float("{:.4f}".format(x["rank"])), "sentence":(x["sentence"][:20] + "...")} for x in main_sentences])
    return {"main_sentences": main_sentences}, 200

if __name__ == "__main__":
    host = "127.0.0.1"
    port = "9003"
    
    log("Listening at http://{}:{}".format(host, port))
    app.run(host=host, port=port)
    