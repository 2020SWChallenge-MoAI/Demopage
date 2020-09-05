var express = require("express");
var router = express.Router();

var utils = require("./utils");

router.get("/data/randtext", function(req, res, next) {
    var logger_caller = "/api/data/randtext(GET)";
    var logger_args = {};

    utils.log(logger_caller, "Success", logger_args);
    return res.status(200).json({
        bid: 123456789,
        title: "RandText - Title",
        author: "RandText - Author",
        publisher: "RandText - Publisher",
        year: "RandText - Year",
        text: "RandText - Text"
    });
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
            "keyword-1",
            "keyword-2",
            "keyword-3"
        ],
        main_sentences: [
            "main-sentence-1",
            "main-sentence-2",
            "main-sentence-3"
        ],
        has_ground_truth: true,
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

module.exports = router;