var express = require("express");
var mysql = require("mysql");
var sync_mysql = require("sync-mysql");
var request = require("request");
var router = express.Router();

var connection = new sync_mysql(require("./dbconfig"));

var utils = require("./utils");

router.get("/data/randtext", function(req, res, next) {
    var logger_caller = "/api/data/randtext(GET)";
    var logger_args = {};
    
    try {
        var qresult = connection.query("SELECT bid, text FROM Book ORDER BY rand() LIMIT 1");
        if (qresult.length == 0) throw new Error("No Entry");

        utils.log(logger_caller, "Success", logger_args);
        return res.status(200).json({
            bid: qresult[0]["bid"],
            text: qresult[0]["text"]
        });
    } catch(e) {
        utils.log(logger_caller, `Error - ${e}`, logger_args, "r");
        return res.status(400).json({
            bid: -1,
            text: ""
        });
    }    
});

router.get("/data/:bid/:qtype/randmatched", function(req, res, next) {
    var logger_caller = "/api/data/:bid/:qtype/randmatched(GET)";
    var logger_args = { bid: req.params.bid, qtype: req.params.qtype };

    var bid = req.params.bid;
    var qtype = req.params.qtype;

    if(qtype == 1) { //객관식
        utils.log(logger_caller, "Success", logger_args);
        return res.status(200).json({
            qaid: 13579,
            q: "RandQA - Question - " + qtype + " - Matched",
            choices: [
                "RandQA - Choices - Matched - 1",
                "RandQA - Choices - Matched - 2",
                "RandQA - Choices - Matched - 3",
                "RandQA - Choices - Matched - 4"
            ],
            a: "1"
        });
    } else if (qtype == 2) { //주관식
        utils.log(logger_caller, "Success", logger_args);
        return res.status(200).json({
            qaid: 13579,
            q: "RandQA - Question - " + qtype + " - Matched",
            a: "RandQA - Answer - Matched"
        });
    }
});

router.get("/data/:bid/:qtype/randunmatched", function(req, res, next) {
    var logger_caller = "/api/data/:bid/:qtype/randunmatched(GET)";
    var logger_args = { bid: req.params.bid, qtype: req.params.qtype };

    var bid = req.params.bid;
    var qtype = req.params.qtype;

    if(qtype == 1) { //객관식
        utils.log(logger_caller, "Success", logger_args);
        return res.status(200).json({
            qaid: 13579,
            q: "RandQA - Question - " + qtype + " - Unmatched",
            choices: [
                "RandQA - Choices - Unmatched - 1",
                "RandQA - Choices - Unmatched - 2",
                "RandQA - Choices - Unmatched - 3",
                "RandQA - Choices - Unmatched - 4"
            ],
            a: "1"
        });
    } else if (qtype == 2) { //주관식
        utils.log(logger_caller, "Success", logger_args);
        return res.status(200).json({
            qaid: 13579,
            q: "RandQA - Question - " + qtype + " - Unmatched",
            a: "RandQA - Answer - Unmatched"
        });
    }
});

router.post("/qna-valid-chk", function(req, res, next) {
    var logger_caller = "/api/qna-valid-chk(POST)";
    var logger_args = { text: req.body.text, qtype: req.body.qtype, question: req.body.question, choices: req.body.choices, answer: req.body.answer };

    var text = req.body.text;
    var qtype = req.body.qtype;
    var question = req.body.question;
    var choices = req.body.choices;
    var answer = req.body.answer;

    utils.log(logger_caller, "Success", logger_args);
    return res.status(200).json({
        bert_answer: "BERT-Answer",
        confidence: 0.8,
        similarity: 0.7
    });
});

router.post("/keyword-ext", function(req, res, next) {
    var logger_caller = "/api/keyword-ext(POST)";
    var logger_args = { bid: req.body.bid, keyword_num: req.body.keyword_num, text: req.body.text };

    var bid = req.body.bid;
    var keyword_num = req.body.keyword_num;
    var text = req.body.text;

    request({
        uri: "http://127.0.0.1:9001/",
        method: "POST",
        body: {
            keyword_num: keyword_num,
            text: text
        },
        json: true
    }, function(err, httpResponse, body) {
        if(err === null && httpResponse.statusCode == 200) {
            var keywords = [];
            for (var keyword of body.keywords) {
                var kid;
                try {
                    var qresult = connection.query(`SELECT kid FROM Keyword WHERE keyword=${mysql.escape(keyword)}`);
                    if(qresult.length == 0) {
                        connection.query(`INSERT INTO Keyword(bid, keyword, created_at, module_version) VALUES (${mysql.escape(bid)}, ${mysql.escape(keyword)}, NOW(), ${mysql.escape("0.0.1")})`);
                        var qresult = connection.query("SELECT LAST_INSERT_ID() as kid");
                        kid = qresult[0]["kid"];
                    } else {
                        kid = qresult[0]["kid"];
                    }
                } catch(e) {
                    utils.log(logger_caller, `Error - ${e}`, logger_args, "r");
                    return res.sendStatus(500);
                }

                keywords.push({
                    kid: kid,
                    keyword: keyword
                });
            }

            utils.log(logger_caller, "Success", logger_args);
            return res.status(200).json({
                keywords: keywords,
                main_sentences: [
                    { sid: 1, main_sentence: "main-sentence-1" },
                    { sid: 2, main_sentence: "main-sentence-2" },
                    { sid: 3, main_sentence: "main-sentence-3" }            
                ],
                has_ground_truth: false,
                keyword_accuracy: 0.8,
                main_sentence_accuracy: 0.7,
                ground_truth: {
                    keywords: [
                        "ground-truth-keyword-1",
                        "ground-truth-keyword-2",
                        "ground-truth-keyword-3"
                    ],
                    main_sentences: [
                        "ground-truth-main-sentence-1",
                        "ground-truth-main-sentence-2",
                        "ground-truth-main-sentence-3"
                    ]
                }
            });
        }
        else {
            utils.log(logger_caller, "Failed", logger_args, "r");
            return res.sendStatus(400);
        }
    })
});

router.post("/keyword-eval", function(req, res, next){
    var logger_caller = "/api/keyword-eval(POST)";
    var logger_args = { evals: req.body.evals };

    var evals = req.body.evals;

    for(var item of evals) {
        try {
            var kid = item["kid"];
            var eval = item["eval"];

            var qresult = connection.query(`SELECT good_count, bad_count FROM Keyword WHERE kid=${mysql.escape(kid)}`);
            if (qresult.length != 1) throw new Error("Invalid kid");

            var good_count = qresult[0]["good_count"];
            var bad_count = qresult[0]["bad_count"];

            if(eval == 1) { //good
                connection.query(`UPDATE Keyword SET good_count=${mysql.escape(good_count + 1)} WHERE kid=${mysql.escape(kid)}`);
            } else if (eval == -1) { //bad
                connection.query(`UPDATE Keyword SET bad_count=${mysql.escape(bad_count + 1)} WHERE kid=${mysql.escape(kid)}`);
            }
        } catch(e) {
            utils.log(logger_caller, `Error - ${e}`, logger_args, "r");
            return res.sendStatus(400);
        }
    }

    utils.log(logger_caller, "Success", logger_args);
    return res.sendStatus(200);
});

router.post("/ner", function(req, res, next){
    var logger_caller = "/api/ner(POST)";
    var logger_args = { bid: req.body.bid, text: req.body.text };

    var bid = req.body.bid;
    var text = req.body.text;

    request({
        uri: "http://127.0.0.1:9002/",
        method: "POST",
        body: {
            text: text
        },
        json: true
    }, function(err, httpResponse, body) {
        if(err === null && httpResponse.statusCode == 200) {
            var sentences = [];
            for (var sentence of body.sentences) {
                var sentence_idx = sentence["sentence_idx"];
                
                var words = [];
                for(var word of sentence["words"]) {
                    var word_idx = word["word_idx"];
                    var word_ = word["word"];
                    var tag = word["tag"];

                    var wid;
                    try {
                        var qresult = connection.query(`SELECT wid FROM NER WHERE word=${mysql.escape(word_)}`);
                        if(qresult.length == 0) {
                            connection.query(`INSERT INTO NER(bid, sentence_idx, word_idx, word, tag, module_version) VALUES (${mysql.escape(bid)}, ${mysql.escape(sentence_idx)}, ${mysql.escape(word_idx)}, ${mysql.escape(word_)}, ${mysql.escape(tag)}, ${mysql.escape("1.0.0")})`);
                            var qresult = connection.query("SELECT LAST_INSERT_ID() as wid");
                            wid = qresult[0]["wid"];
                        } else {
                            wid = qresult[0]["wid"];
                        }
                    } catch(e) {
                        utils.log(logger_caller, `Error - ${e}`, logger_args, "r");
                        return res.sendStatus(500);
                    }

                    words.push({
                        wid: wid,
                        word_idx: word_idx,
                        word: word_,
                        tag: tag
                    });
                }

                sentences.push({
                    sentence_idx: sentence_idx,
                    words: words
                });
            }

            utils.log(logger_caller, "Success", logger_args);
            return res.status(200).json({
                sentences: sentences
            });
        }
        else {
            utils.log(logger_caller, "Failed", logger_args, "r");
            return res.sendStatus(400);
        }
    })
});

router.post("/ner-eval", function(req, res, next){
    var logger_caller = "/api/ner-eval(POST)";
    var logger_args = { words: req.body.words };

    var words = req.body.words;

    for(var word of words) {
        if(!["TRM-B", "TRM-I", "LOC-B", "LOC-I", "CVL-B", "CVL-I", "ANM-B", "ANM-I", "ORG-B", "ORG-I", "EVT-B", "EVT-I", "DAT-B", "DAT-I", "NUM-B", "NUM-I", "PER-B", "PER-I", "TIM-B", "TIM-I", "AFW-B", "AFW-I", "FLD-B", "FLD-I", "MAT-B", "MAT-I", "PLT-B", "PLT-I", "O"].includes(word["tag"])) {
            utils.log(logger_caller, `Error - Invalid tag`, logger_args, "r");
            return res.sendStatus(400);
        }
    }

    for(var word of words) {
        try {
            var wid = word["wid"];
            var tag = word["tag"].split("-").join("_");

            var qresult = connection.query(`SELECT ${tag} FROM NER WHERE wid=${mysql.escape(wid)}`);
            if (qresult.length != 1) throw new Error("Invalid wid");

            var count = Number(qresult[0][tag]);
            connection.query(`UPDATE NER SET ${tag}=${count + 1} WHERE wid=${mysql.escape(wid)}`);
        } catch(e) {
            utils.log(logger_caller, `Error - ${e}`, logger_args, "r");
            return res.sendStatus(400);
        }
    }

    utils.log(logger_caller, "Success", logger_args);
    return res.sendStatus(200);
});

module.exports = router;