import os
from kobertner import KoBERT_NER, preprocess
from konlpy.tag import Komoran
from flask import Flask, request
import logging
import sys
import datetime

from numpy.lib.shape_base import take_along_axis

def log(msg):
    curtime = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    print("\x1b[32m[NER Server, {}]\x1b[0m {}".format(curtime, msg))

app = Flask(__name__)

# Turn off flask default log
app.logger.disable = True
logging.getLogger("werkzeug").disabled = True
sys.modules["flask.cli"].show_server_banner = lambda *x: None

model = KoBERT_NER(model_dir=os.path.join(os.path.dirname(__file__), 'model/ner'),gpu=True)
komoran = Komoran()
log("\"pytorch_model.bin\" Loaded")
log(f"NER model is on {model.device}")

def parse_bio_tag(sentences, sentences_tags):
    all_NER = []
    for sentence, tags in zip(sentences, sentences_tags):
        complete_word_tag = ''
        complete_word = []

        for i, (word,tag) in enumerate(zip(sentence, tags)):
            if tag=='O':
                continue
                
            if not (tag[-1]=='I' and i>0 and tags[i-1][:3]==tags[i][:3]):
                if len(complete_word)!=0:
                    all_NER.append((complete_word_tag, " ".join(complete_word)))
                    complete_word = []
                
            complete_word_tag=tag[:3]
            complete_word.append(word)
        
        if len(complete_word)!=0:
            all_NER.append((complete_word_tag, " ".join(complete_word)))
            complete_word = []
    
    return all_NER


def tokenize_ner(ners):
    tokenized_ners = set()
    for ner in ners:
        word = ''
        poss = komoran.pos(ner[1])
        for pos in poss:
            if pos[0]=='(':
                break
            if pos[1].startswith('N') or pos[1].startswith('M') or pos[1].startswith('SN'):
                word+=pos[0]
        if word!='':      
            tokenized_ners.add((ner[0],word))

    return list(tokenized_ners)

@app.route("/", methods=['POST'])
def analyze():
    json = request.get_json()
    text = json["text"]
    sentences = preprocess(text)

    tags = model.predict(batch_size=256, sentences=sentences)
    ners = parse_bio_tag(sentences, tags)
    ners = tokenize_ner(ners)

    ret={'ners':[]}
    for ner in ners:
        ret['ners'].append({'tag': ner[0], 'word': ner[1]})
    # print(ret)
    return ret, 200


if __name__ == "__main__":
    host = "127.0.0.1"
    port = "9002"
    
    log("Listening at http://{}:{}".format(host, port))
    app.run(host=host, port=port)
    