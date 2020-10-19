from keyext import preprocess, KeywordExtractor
from keyext_102 import preprocess as preprocess_102, KeywordExtractor as KeywordExtractor102

import os
from flask import Flask, request
import logging
import sys
import datetime

def log(msg):
    curtime = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    print("\x1b[32m[Keyword Extraction Server, {}]\x1b[0m {}".format(curtime, msg))

extractor = KeywordExtractor()
extractor_102 = KeywordExtractor102()

app = Flask(__name__)

# Turn off flask default log
app.logger.disable = True
logging.getLogger("werkzeug").disabled = True
sys.modules["flask.cli"].show_server_banner = lambda *x: None

# create keyword-extractor.pkl if not exist
""" if "keyword-extractor.pkl" not in os.listdir(os.path.join(os.path.dirname(__file__), "model/keyword-extraction")):
    log("\"keyword-extraction.pkl\" file not exist. Creating one...")

    path = "../book/woongjin/raw"
    files = sorted([x for x in os.listdir(path) if x.endswith(".txt")], key=lambda x: int(".".join(x.split(".")[:-1])))

    build_data = []
    for i, filename in enumerate(files):
        log("{}/{} : {}".format(i + 1, len(files), filename))

        bid = int(".".join(filename.split(".")[:-1]))

        with open(os.path.join(path, filename), "r") as f:
            text = f.read()

        build_data.append([bid, preprocess(text)])

    extractor.build(build_data)
    extractor.save(os.path.join(os.path.dirname(__file__), "model/keyword-extraction", "keyword-extractor.pkl"))
"""

# load keyword-extractor.pkl
extractor_102.load(os.path.join(os.path.join(os.path.dirname(__file__), "model/keyword-extraction/keyword-extractor-102.pkl")))
log("keyword extraction module v1.0.2 Loaded")
extractor.load(os.path.join(os.path.join(os.path.dirname(__file__), "model/keyword-extraction/keyword-extractor-current.pkl")))
log("keyword extraction module (current version) Loaded")

@app.route("/", methods=['POST'])
def extract():
    json = request.get_json()
    bid = int(json["bid"])
    keyword_num = int(json["keyword_num"])
    text = json["text"]
    model_ver = json["keyword_model_ver"]
    keyword_history = json["keyword_history"]

    keywords = []
    if model_ver == 'v1.0.2':
        if bid in extractor_102._documents:
            keywords = extractor_102.recommend(bid, num=keyword_num, keyword_history=keyword_history)
        else:
            keywords = extractor_102.recommend_from_sentences(preprocess_102(text), num=keyword_num, keyword_history=keyword_history)
        keywords = sorted(keywords, key=lambda k: -k['weight'])
    else:
        if bid in extractor.documents:
            keywords = extractor.recommend(bid, num=keyword_num, queries=keyword_history)
        else:
            keywords = extractor.recommend_from_sentences(preprocess(text), num=keyword_num, queries=keyword_history)

    log([{"weight":float("{:.4f}".format(x["weight"])), "word":x["word"]} for x in keywords])
    return {"keywords": keywords}, 200

if __name__ == "__main__":
    host = "127.0.0.1"
    port = "9001"
    
    log("Listening at http://{}:{}".format(host, port))
    app.run(host=host, port=port)
    