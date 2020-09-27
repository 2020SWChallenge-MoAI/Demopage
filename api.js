var express = require("express");
var mysql = require("mysql2/promise");
//var sync_mysql = require("sync-mysql");
var request = require("request");
var fs = require("fs");
var router = express.Router();

var pool = mysql.createPool({
    host: "localhost",
    user: "demo_webserver",
    password: "demo_webserver",
    database: "demo_webserver"
});

var utils = require("./utils");
const { response } = require("express");

async function saveTextWithNewBID(text, logger_caller, logger_args) {
    var path = "../book/woongjin/raw/";

    //read book directory and issue new bid
    try {
        function readdir_promise(path) {
            return new Promise((resolve, reject) => {
                fs.readdir(path, "utf-8", function(error, files) {
                    if(error) reject(error);
                    resolve(files);
                });
            });
        }

        bid = (await readdir_promise(path)).filter(x => /^[0-9]+\.txt$/.test(x)).map(x => Number(x.substring(0, x.lastIndexOf(".")))).reduce((a, b) => Math.max(a, b)) + 1;
    } catch(error) {
        utils.log(logger_caller, error, logger_args, "r");
        return res.sendStatus(400);
    }

    // save text
    try {
        function writefile_promise(filename, data) {
            return new Promise((resolve, reject) => {
                fs.writeFile(filename, data, function(error) {
                    if(error) reject(error);
                    resolve();
                });
            });
        }

        await writefile_promise(`${path + bid}.txt`, text);
    } catch(error) {
        utils.log(logger_caller, error, logger_args, "r");
        return res.sendStatus(400);
    }

    utils.log(logger_caller, `New Text : Save it to ${bid}.txt`, logger_args, "y");

    return bid;
}

router.get("/data/loadtext", function(req, res, next) {
    var logger_caller = "/api/data/randtext(GET)";
    var logger_args = { bid: req.query.bid };

    var bid = Number(req.query.bid);
    if(bid === NaN) bid = -1;
    
    var book_dir = "../book/woongjin/raw/";
    fs.readdir(book_dir, function(error, filelist) {
        if(error) {
            utils.log(logger_caller, `Error - ${error}`, logger_args, "r");
            return res.status(400).json({
                bid: -1,
                text: ""
            });
        }
        
        if(bid != -1 && !filelist.includes(bid + ".txt")) bid = -1;

        var filename;
        if(bid == -1) {
            filename = filelist[Math.floor(Math.random() * filelist.length)];
            bid = Number(filename.substring(0, filename.lastIndexOf(".")));
        } else {
            filename = bid + ".txt";
        }
        
        fs.readFile(book_dir + filename, 'utf8', function(error, text) {
            if(error) {
                utils.log(logger_caller, `Error - ${error}`, logger_args, "r");
                return res.status(400).json({
                    bid: -1,
                    text: ""
                });
            }

            utils.log(logger_caller, "Success", logger_args);
            return res.status(200).json({
                bid: bid,
                text: text
            });
        })
    })
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

router.post("/keyword-ext", async function(req, res, next) {
    var logger_caller = "/api/keyword-ext(POST)";
    var logger_args = { bid: req.body.bid, keyword_model_ver: req.body.keyword_model_ver, keyword_num: req.body.keyword_num, main_sentence_model_ver: req.body.main_sentence_model_ver, main_sentence_num: req.body.main_sentence_num, text: req.body.text };

    var bid = req.body.bid;
    var text = req.body.text;
    var keyword_model_ver = req.body.keyword_model_ver;
    var keyword_num = req.body.keyword_num;
    var main_sentence_model_ver = req.body.main_sentence_model_ver;
    var main_sentence_num = req.body.main_sentence_num;

    if(bid == -1) { //given text is new text -> save
        bid = await saveTextWithNewBID(text, logger_caller, logger_args);
    }

    //keyword
    function keyword_ext(keyword_model_ver, keyword_num, bid, text) {
        return new Promise((resolve, reject) => {
            request({
                uri: "http://127.0.0.1:9001/",
                method: "POST",
                body: {
                    keyword_model_ver: keyword_model_ver,
                    keyword_num: keyword_num,
                    text: text
                },
                json: true
            }, async function(error, httpResponse, body) {
                if(error) reject(error);
                if(httpResponse.statusCode != 200) reject(`Http Response Code ${httpResponse.statusCode}`);
                
                try{
                    var connection = await pool.getConnection();
                    await connection.beginTransaction();

                    var keywords = [];

                    for (var keyword of body.keywords) {
                        var kid;
                        try {
                            var qresult = (await connection.execute("SELECT kid FROM Keyword WHERE bid=? AND keyword=? AND module_version=?", [bid, keyword.word, keyword_model_ver]))[0]; // 쿼리 실행 결과 [row, field]가 나오므로 [0]으로 row만 선택

                            if(qresult.length == 0) {
                                qresult = await connection.execute("INSERT INTO Keyword(bid, keyword, weight, created_at, module_version) VALUES (?, ?, ?, NOW(), ?)", [bid, keyword.word, keyword.weight, keyword_model_ver]);
                                kid = qresult[0]["insertId"];
                            } else {
                                kid = qresult[0]["kid"];
                            }

                            keywords.push({
                                kid: kid,
                                keyword: keyword
                            });
                        } catch(error) {
                            reject(error);
                        }
                    }

                    await connection.commit();
                    resolve(keywords);
                } catch(error) {
                    reject(error);
                } finally {
                    connection.release();
                }
            })
        });
    }

    var keywords;
    try {
        keywords = await keyword_ext(keyword_model_ver, keyword_num, bid, text);
    } catch(error) {
        utils.log(logger_caller, error, logger_args, "r");
        return res.sendStatus(400);
    }

    //main sentence
    function main_sentence_ext(main_sentence_model_ver, main_sentence_num, bid, text) {
        return new Promise((resolve, reject) => {
            request({
                uri: "http://127.0.0.1:9003/",
                method: "POST",
                body: {
                    main_sentence_model_ver: main_sentence_model_ver,
                    main_sentence_num: main_sentence_num,
                    text: text
                },
                json: true
            }, async function(error, httpResponse, body) {
                if(error) reject(error);
                if(httpResponse.statusCode != 200) reject(`Http Response Code ${httpResponse.statusCode}`);
                
                try{
                    var connection = await pool.getConnection();
                    await connection.beginTransaction();

                    var main_sentences = [];

                    for (var main_sentence of body.main_sentences) {
                        var sid;
                        try {
                            var qresult = (await connection.execute("SELECT sid FROM MainSentence WHERE bid=? AND main_sentence=? AND module_version=?", [bid, main_sentence.sentence, main_sentence_model_ver]))[0]; // 쿼리 실행 결과 [row, field]가 나오므로 [0]으로 row만 선택

                            if(qresult.length == 0) {
                                qresult = await connection.execute("INSERT INTO MainSentence(bid, main_sentence, rank, created_at, module_version) VALUES (?, ?, ?, NOW(), ?)", [bid, main_sentence.sentence, main_sentence.rank, main_sentence_model_ver]);
                                sid = qresult[0]["insertId"];
                            } else {
                                sid = qresult[0]["sid"];
                            }

                            main_sentences.push({
                                sid: sid,
                                main_sentence: main_sentence
                            });

                        } catch(error) {
                            reject(error);
                        }
                    }

                    await connection.commit();
                    resolve(main_sentences);
                } catch(error) {
                    reject(error);
                } finally {
                    connection.release();
                }
            })
        });
    }

    var main_sentences;
    try {
        main_sentences = await main_sentence_ext(main_sentence_model_ver, main_sentence_num, bid, text);
    } catch(error) {
        utils.log(logger_caller, error, logger_args, "r");
        return res.sendStatus(400);
    }

    //ner
    function ner(text) {
        return new Promise((resolve, reject) => {
            request({
                uri: "http://127.0.0.1:9002/",
                method: "POST",
                body: {
                    text: text
                },
                json: true
            }, function(error, httpResponse, body) {
                if(error) reject(error);
                if(httpResponse.statusCode != 200) reject(`Http Response Code ${httpResponse.statusCode}`);
                
                var word_tags = {};
                for (var sentence of body.sentences) {
                    var sentence_idx = sentence["sentence_idx"];
                    
                    for(var item of sentence["words"]) {
                        var word_idx = item["word_idx"];
                        var word = item["word"];
                        var tag = item["tag"];

                        if(tag != "O") {
                            if(Object.keys(word_tags).includes(word)) {
                                if(Object.keys(word_tags[word]).includes(tag)) {
                                    word_tags[word][tag] += 1;
                                } else {
                                    word_tags[word][tag] = 1;
                                }
                            } else {
                                word_tags[word] = {};
                                word_tags[word][tag] = 1;
                            }
                        }
                    }
                }

                //sort
                word_tags_array = [];
                for(var i = 0; i < Object.keys(word_tags).length; i++) {
                    var key = Object.keys(word_tags)[i];

                    var tags_array = Object.keys(word_tags[key]).map((x) => [x, word_tags[key][x]]);
                    tags_array.sort((a, b) => (b[1] - a[1]));

                    word_tags[key] = {};
                    var total = 0;
                    for(var item of tags_array) {
                        word_tags[key][item[0]] = item[1];
                        total += item[1];
                    }

                    word_tags_array.push([total, key, word_tags[key]]);
                }

                word_tags_array.sort((a, b) => (b[0] - a[0]));

                word_tags = [];
                for(var item of word_tags_array) {
                    word_tags.push({
                        word: item[1],
                        tags: item[2]
                    });
                }

                resolve(word_tags);
            })
        });
    }

    var word_tags;
    try {
        word_tags = await ner(text);
    } catch(error) {
        utils.log(logger_caller, error, logger_args, "r");
        return res.sendStatus(400);
    }

    return res.status(200).json({
        keywords: keywords,
        main_sentences: main_sentences,
        word_tags: word_tags
    })
});

router.post("/keyword-eval", async function(req, res, next){
    var logger_caller = "/api/keyword-eval(POST)";
    var logger_args = { evals: req.body.evals };

    var evals = req.body.evals;

    try{
        var connection = await pool.getConnection();
        await connection.beginTransaction();

        for(var item of evals) {
            var kid = item["kid"];
            var eval = item["eval"];

            try {
                var qresult = (await connection.execute("SELECT good_count, bad_count FROM Keyword WHERE kid=?", [kid]))[0]; // 쿼리 실행 결과 [row, field]가 나오므로 [0]으로 row만 선택
                if (qresult.length != 1) reject("Invalid kid");

                var good_count = Number(qresult[0]["good_count"]);
                var bad_count = Number(qresult[0]["bad_count"]);

                if(eval == 1) { //good
                    await connection.execute("UPDATE Keyword SET good_count=? WHERE kid=?", [good_count + 1, kid]);
                } else if (eval == -1) { //bad
                    await connection.execute("UPDATE Keyword SET bad_count=? WHERE kid=?", [bad_count + 1, kid]);
                }
            } catch(error) {
                throw error;
            }
        }

        await connection.commit();

        utils.log(logger_caller, "Success", logger_args);
        return res.sendStatus(200);
    } catch(error) {
        utils.log(logger_caller, error, logger_args, "r");
        return res.sendStatus(400);
    } finally {
        connection.release();
    }
});

router.post("/main-sentence-eval", async function(req, res, next){
    var logger_caller = "/api/main-sentence-eval(POST)";
    var logger_args = { evals: req.body.evals };

    var evals = req.body.evals;

    try{
        var connection = await pool.getConnection();
        await connection.beginTransaction();

        for(var item of evals) {
            var sid = item["sid"];
            var eval = item["eval"];

            try {
                var qresult = (await connection.execute("SELECT good_count, bad_count FROM MainSentence WHERE sid=?", [sid]))[0]; // 쿼리 실행 결과 [row, field]가 나오므로 [0]으로 row만 선택
                if (qresult.length != 1) reject("Invalid sid");

                var good_count = Number(qresult[0]["good_count"]);
                var bad_count = Number(qresult[0]["bad_count"]);

                if(eval == 1) { //good
                    await connection.execute("UPDATE MainSentence SET good_count=? WHERE sid=?", [good_count + 1, sid]);
                } else if (eval == -1) { //bad
                    await connection.execute("UPDATE MainSentence SET bad_count=? WHERE sid=?", [bad_count + 1, sid]);
                }
            } catch(error) {
                throw error;
            }
        }

        await connection.commit();
        
        utils.log(logger_caller, "Success", logger_args);
        return res.sendStatus(200);
    } catch(error) {
        utils.log(logger_caller, error, logger_args, "r");
        return res.sendStatus(400);
    } finally {
        connection.release();
    }
});

router.post("/ner", async function(req, res, next){
    var logger_caller = "/api/ner(POST)";
    var logger_args = { bid: req.body.bid, text: req.body.text };

    var bid = req.body.bid;
    var text = req.body.text;

    if(bid == -1) { //given text is new text -> save
        bid = await saveTextWithNewBID(text, logger_caller, logger_args);
    }

    function ner(text) {
        return new Promise((resolve, reject) => {
            request({
                uri: "http://127.0.0.1:9002/",
                method: "POST",
                body: {
                    text: text
                },
                json: true
            }, function(error, httpResponse, body) {
                if(error) reject(error);
                if(httpResponse.statusCode != 200) reject(`Http Response Code ${httpResponse.statusCode}`);
                
                var word_tags = {};
                for (var sentence of body.sentences) {
                    var sentence_idx = sentence["sentence_idx"];
                    
                    for(var item of sentence["words"]) {
                        var word_idx = item["word_idx"];
                        var word = item["word"];
                        var tag = item["tag"];

                        if(tag != "O") {
                            if(Object.keys(word_tags).includes(word)) {
                                if(Object.keys(word_tags[word]).includes(tag)) {
                                    word_tags[word][tag] += 1;
                                } else {
                                    word_tags[word][tag] = 1;
                                }
                            } else {
                                word_tags[word] = {};
                                word_tags[word][tag] = 1;
                            }
                        }
                    }
                }

                resolve(word_tags);
            })
        });
    }

    var body;
    try {
        body = await ner(text);
    } catch(error) {
        utils.log(logger_caller, error, logger_args, "r");
        return res.sendStatus(400);
    }

    var word_tags = {};
    for (var sentence of body.sentences) {
        var sentence_idx = sentence["sentence_idx"];
        
        for(var item of sentence["words"]) {
            var word_idx = item["word_idx"];
            var word = item["word"];
            var tag = item["tag"];

            if(tag != "O") {
                if(Object.keys(word_tags).includes(word)) {
                    if(Object.keys(word_tags[word]).includes(tag)) {
                        word_tags[word][tag] += 1;
                    } else {
                        word_tags[word][tag] = 1;
                    }
                } else {
                    word_tags[word] = {};
                    word_tags[word][tag] = 1;
                }
            }
        }
    }

    return res.sendStatus(400);
/*
    try {
        var connection = await pool.getConnection();
        await connection.beginTransaction();

            try {
                var qresult = (await connection.execute("SELECT good_count, bad_count FROM Keyword WHERE kid=?", [kid]))[0]; // 쿼리 실행 결과 [row, field]가 나오므로 [0]으로 row만 선택
                if (qresult.length != 1) reject("Invalid kid");

                var good_count = Number(qresult[0]["good_count"]);
                var bad_count = Number(qresult[0]["bad_count"]);

                if(eval == 1) { //good
                    await connection.execute("UPDATE Keyword SET good_count=? WHERE kid=?", [good_count + 1, kid]);
                } else if (eval == -1) { //bad
                    await connection.execute("UPDATE Keyword SET bad_count=? WHERE kid=?", [bad_count + 1, kid]);
                }
            } catch(error) {
                throw error;
            }
        }

        await connection.commit();

        utils.log(logger_caller, "Success", logger_args);
        return res.sendStatus(200);
    } catch(error) {
        utils.log(logger_caller, error, logger_args, "r");
        return res.sendStatus(400);
    } finally {
        connection.release();
    }*/

/*
    request({
        uri: "http://127.0.0.1:9002/",
        method: "POST",
        body: {
            text: text
        },
        json: true
    }, async function(err, httpResponse, body) {
        if(err === null && httpResponse.statusCode == 200) {
            var sentences = [];
            for (var sentence of body.sentences) {
                var sentence_idx = sentence["sentence_idx"];
                
                var words = [];
                for(var word of sentence["words"]) {
                    var word_idx = word["word_idx"];
                    var word_ = word["word"];
                    var tag = word["tag"];

                    var wid = -1;
                    //try {
                    //    var qresult = connection.query(`SELECT wid FROM NER WHERE word=${mysql.escape(word_)}`);
                    //    if(qresult.length == 0) {
                    //        connection.query(`INSERT INTO NER(bid, sentence_idx, word_idx, word, tag, module_version) VALUES (${mysql.escape(bid)}, ${mysql.escape(sentence_idx)}, ${mysql.escape(word_idx)}, ${mysql.escape(word_)}, ${mysql.escape(tag)}, ${mysql.escape("1.0.0")})`);
                    //        var qresult = connection.query("SELECT LAST_INSERT_ID() as wid");
                    //        wid = qresult[0]["wid"];
                    //    } else {
                    //        wid = qresult[0]["wid"];
                    //    }
                    //} catch(e) {
                    //    utils.log(logger_caller, `Error - ${e}`, logger_args, "r");
                    //    return res.sendStatus(500);
                    //}

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
    })*/
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