var express = require("express");
var mysql = require("mysql");
var sync_mysql = require("sync-mysql");
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
    var logger_args = { text: req.body.text };

    utils.log(logger_caller, "Success", logger_args);
    return res.status(200).json({
        keywords: [
            { kid: 1, keyword: "keyword-1" },
            { kid: 2, keyword: "keyword-2" },
            { kid: 3, keyword: "keyword-3" }
        ],
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
});

router.post("/keyword-eval", function(req, res, next){
    var logger_caller = "/api/keyword-eval(POST)";
    var logger_args = { evals: req.body.evals };

    var evals = req.body.evals;

    for(var item in evals) {
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

            utils.log(logger_caller, "Success", logger_args);
            return res.sendStatus(200);
        } catch(e) {
            utils.log(logger_caller, `Error - ${e}`, logger_args, "r");
            return res.sendStatus(400);
        }
    }
});

module.exports = router;