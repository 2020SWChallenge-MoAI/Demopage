from keyext import preprocess, KeywordExtractor
import os
from flask import Flask, request
import logging
import sys
import datetime

def log(msg):
    curtime = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    print("\x1b[32m[Keyword Extraction Server, {}]\x1b[0m {}\n".format(curtime, msg))

extractor = KeywordExtractor()
app = Flask(__name__)

# Turn off flask default log
app.logger.disable = True
logging.getLogger("werkzeug").disabled = True
sys.modules["flask.cli"].show_server_banner = lambda *x: None

if "keyword-extractor.pkl" not in os.listdir(os.path.join(os.path.dirname(__file__), "model/keyword-extraction")):
    log("\"keyword-extraction.pkl\" file not exist. Creating one...")

    import pymysql

    db = pymysql.connect(
        user='demo_webserver',
        passwd='demo_webserver',
        host='127.0.0.1',
        db='demo_webserver',
        charset='utf8'
    )

    cursor = db.cursor(pymysql.cursors.DictCursor)

    cursor.execute("SELECT bid, text FROM Book;")
    result = cursor.fetchall()

    build_data = []
    for i, item in enumerate(result):
        log("{}/{}".format(i + 1, len(result)))
        build_data.append([item["bid"], preprocess(item["text"])])

    extractor.build(build_data)
    extractor.save(os.path.join(os.path.dirname(__file__), "keyword-extractor.pkl"))

extractor.load(os.path.join(os.path.join(os.path.dirname(__file__), "model/keyword-extraction/keyword-extractor.pkl")))
log("\"keyword-extraction.pkl\" Loaded")

@app.route("/", methods=['POST'])
def extract():
    json = request.get_json()
    keyword_num = int(json["keyword_num"])
    text = json["text"]
    
    keywords = extractor.recommend_from_sentences(preprocess(text), num=keyword_num)
    
    log(keywords)
    return {"keywords": keywords}, 200

if __name__ == "__main__":
    host = "127.0.0.1"
    port = "9001"
    
    log("Listening at http://{}:{}".format(host, port))
    app.run(host=host, port=port)
    