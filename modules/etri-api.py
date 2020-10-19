import os
from os import abort
import re
import sys
import logging
import requests
import datetime
from flask import Flask, request

app = Flask(__name__)

# Turn off flask default log
app.logger.disable = True
logging.getLogger("werkzeug").disabled = True
sys.modules["flask.cli"].show_server_banner = lambda *x: None

def log(msg):
    curtime = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    print("\x1b[32m[ETRI API, {}]\x1b[0m {}".format(curtime, msg))

URL = 'http://aiopen.etri.re.kr:8000/WiseNLU'

def request_etri(text, spoken):
    url = URL+'_spoken' if spoken else URL
    key = '7be56042-2064-4ff8-b8b1-9f2948947d74'
    return requests.post(url,
        json={
            'access_key': key,
            'argument':{
                'analysis_code':'ner',
                'text':text
            }
        }).json()

def parse_ner(response):
    return_strings = []
    return_weights = []
    
    sentences = response['return_object']['sentence']
    for sentence in sentences:
        i = 0
        tags = sentence['NE']
        if len(tags)==0:
            continue
            
        sentence_words = []
        sentence_tags = []
        sentence_tags_weight = []
        for word in sentence['word']:
            if i<len(tags) and tags[i]['begin']>=word['begin'] and tags[i]['end']<=word['end']:
                sentence_tags.append(tags[i]['type'])
                sentence_tags_weight.append(tags[i]['weight'])
                i+=1
            else:
                sentence_tags.append('O')
                sentence_tags_weight.append(0)
                
            sentence_words.append(word['text'])
        
        return_strings.append(" ".join(sentence_words)+'\t'+" ".join(sentence_tags))
        return_weights.append(sentence_tags_weight)
    
    return return_strings, return_weights

def format_response():
    pass

@app.route("/", methods=['POST'])
def analyze():
    json = request.get_json()
    text = json['text']
    # spoken = json['spoken']

    if len(text)>9700:
        text = text[:9700]
        # abort(413)

    response = request_etri(text, spoken=True)
    # sentences_tags, weights = parse_ner(response)
    
    sentences = response['return_object']['sentence']

    words_with_tags = [[(word['text'], word['type']) for word in sentence['NE']] for sentence in sentences]

    # sentences = [sent.split('\t')[0].split() for sent in sentences_tags]
    # tags = [sent.split('\t')[1].split() for sent in sentences_tags]

    predictions = {'sentences': []}
    for sentence in words_with_tags:
        sentence_info = {
            'words':[]
            }
        for (word, tag) in sentence:
            sentence_info['words'].append({
                'word': word,
                'tag': tag,
            })
    
        predictions['sentences'].append(sentence_info)
    
    # log(predictions)
    return predictions, 200

if __name__ == "__main__":
    host = "127.0.0.1"
    port = "9004"
    
    log("Listening at http://{}:{}".format(host, port))
    app.run(host=host, port=port)