from keyext import preprocess, KeywordExtractor
import os
from flask import Flask, request
import logging
import sys
import datetime

def log(msg):
    curtime = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    print("\x1b[32m[Keyword Extraction Server, {}]\x1b[0m {}".format(curtime, msg))

extractor = KeywordExtractor()
app = Flask(__name__)

# Turn off flask default log
app.logger.disable = True
logging.getLogger("werkzeug").disabled = True
sys.modules["flask.cli"].show_server_banner = lambda *x: None

# create keyword-extractor.pkl if not exist
if "keyword-extractor.pkl" not in os.listdir(os.path.join(os.path.dirname(__file__), "model/keyword-extraction")):
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

# load keyword-extractor.pkl
extractor.load(os.path.join(os.path.join(os.path.dirname(__file__), "model/keyword-extraction/keyword-extractor.pkl")))
log("\"keyword-extraction.pkl\" Loaded")

@app.route("/", methods=['POST'])
def extract():
    json = request.get_json()
    keyword_num = int(json["keyword_num"])
    text = json["text"]
    model_ver = json["keyword_model_ver"]
    keyword_history = json["keyword_history"]
    
    keywords = extractor.recommend_from_sentences(preprocess(text), num=keyword_num)
    
    log([{"weight":float("{:.4f}".format(x["weight"])), "word":x["word"]} for x in keywords])
    return {"keywords": keywords}, 200

if __name__ == "__main__":
    host = "127.0.0.1"
    port = "9001"
    
    log("Listening at http://{}:{}".format(host, port))
    app.run(host=host, port=port)
    