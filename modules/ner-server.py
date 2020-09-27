import os
from kobert4ner import KoBERT_NER, preprocess
from flask import Flask, request
import logging
import sys
import datetime

def log(msg):
    curtime = datetime.datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    print("\x1b[32m[NER Server, {}]\x1b[0m {}".format(curtime, msg))

app = Flask(__name__)

# Turn off flask default log
app.logger.disable = True
logging.getLogger("werkzeug").disabled = True
sys.modules["flask.cli"].show_server_banner = lambda *x: None

model = KoBERT_NER(model_dir=os.path.join(os.path.dirname(__file__), 'model/ner'),gpu=True)
log("\"pytorch_model.bin\" Loaded")
log(f"NER model is on {model.device}")

@app.route("/", methods=['POST'])
def analyze():
    json = request.get_json()
    text = json["text"]
    result = model.predict(batch_size=256, sentences=preprocess(text))
    return result, 200

if __name__ == "__main__":
    host = "127.0.0.1"
    port = "9002"
    
    log("Listening at http://{}:{}".format(host, port))
    app.run(host=host, port=port)
    