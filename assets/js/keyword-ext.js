function get_keyword_html(kid, keyword, good_count, bad_count) {
    var html = `<div class="input-group keyword">
    <input type="text" class="form-control border border-dark" value="[${Number(keyword.weight).toFixed(3)}] [${good_count}/${bad_count}] ${keyword.word}" disabled>
    <input type="hidden" class="kid" value="${kid}">
    <div class="input-group-append btn-group btn-group-toggle d-flex" data-toggle="buttons">
        <label class="btn btn-outline-primary flex-even">
            <input type="radio" class="eval" name="keyword-${kid}-eval" value="1"><i class="far fa-thumbs-up"></i>
        </label>
        <label class="btn btn-outline-danger flex-even">
            <input type="radio" class="eval" name="keyword-${kid}-eval" value="-1"><i class="far fa-thumbs-down"></i>
        </label>
    </div>    
</div>`;

    return html;
}

function get_main_sentence_html(sid, main_sentence, good_count, bad_count) {
    var html = `<div class="input-group main-sentence">
    <textarea type="text" class="form-control border border-dark" rows="5" disabled>[${Number(main_sentence.rank).toFixed(3)}] [${good_count}/${bad_count}] ${main_sentence.sentence}</textarea>
    <input type="hidden" class="sid" value="${sid}">
    <div class="input-group-append btn-group btn-group-toggle d-flex" data-toggle="buttons">
        <label class="btn btn-outline-primary flex-even">
            <input type="radio" class="eval" name="main-sentence-${sid}-eval" value="1"><i class="far fa-thumbs-up"></i>
        </label>
        <label class="btn btn-outline-danger flex-even">
            <input type="radio" class="eval" name="main-sentence-${sid}-eval" value="-1"><i class="far fa-thumbs-down"></i>
        </label>
    </div>   
</div>`;

    return html;
}

function get_ner_wordcloud_html(word, tags) {
    var html = `<span class="word-tag tag-${Object.keys(tags)[0].split("-")[0]}">${word}`;
    
    for(var tag of Object.keys(tags)) {
        html += ` [${tag}(${tags[tag]})]`
    }

    html += `</span>`;

    return html;
}

function get_ner_summary_html(data) {
    var result = {
        TRM: 0,
        LOC: 0,
        CVL: 0,
        ANM: 0,
        ORG: 0,
        EVT: 0,
        DAT: 0,
        NUM: 0,
        PER: 0,
        TIM: 0,
        AFW: 0,
        FLD: 0,
        MAT: 0,
        PLT: 0,
    };

    var total = 0;

    for(var word_tag of data) {
        for(var tag of Object.keys(word_tag["tags"])) {
            result[tag.split("-")[0]] += word_tag["tags"][tag];
            total += word_tag["tags"][tag];
        }
    }

    result_array = [];
    for(var i = 0; i < Object.keys(result).length; i++) {
        var key = Object.keys(result)[i];

        var count = result[key];

        if(count != 0) result_array.push([key, count]);
    }
    result_array.sort((a, b) => (b[1] - a[1]));

    var html = "<ul>";
    for(var item of result_array) {
        html += `<li>${item[0]} : ${item[1]} / ${total} = ${(100 * item[1] / total).toFixed(2)}%</li>`;
    }
    html += "</ul>";

    return html;
}

function ner_wordcloud_filter_apply() {
    var tags = [
        "TRM",
        "LOC",
        "CVL",
        "ANM",
        "ORG",
        "EVT",
        "DAT",
        "NUM",
        "PER",
        "TIM",
        "AFW",
        "FLD",
        "MAT",
        "PLT"
    ];

    var is_all_unchecked = true;
    for(var tag of tags) {
        var is_checked = $(`#NERCell div.cell-content div.filter div.options input[type=checkbox]#NER-Tag-${tag}`).prop("checked");

        var target = $(`#NERCell div.cell-content div.word-cloud span.word-tag.tag-${tag}`);

        if(is_checked) {
            is_all_unchecked = false;
            target.removeClass("d-none");
        } else {
            target.addClass("d-none");
        }
    }

    if(is_all_unchecked) {
        $(`#NERCell div.cell-content div.word-cloud span.word-tag`).removeClass("d-none");
    }
}

function on_dec_btn_clicked(target) {
    var cur_val = parseInt(Number(target.val()));

    if (cur_val === NaN) {
        target.val("5");
    } else if(cur_val <= 1) {
        target.val("1");
    } else {
        target.val(cur_val - 1);
    }
}

function on_inc_btn_clicked(target) {
    var cur_val = parseInt(Number(target.val()));

    if (cur_val === NaN) {
        target.val("5");
    } else if(cur_val < 1) {
        target.val("1");
    } else {
        target.val(cur_val + 1);
    }
}

$("#KeywordNumDecBtn").click(function() {
    on_dec_btn_clicked($("#KeywordNum"));
});

$("#KeywordNumIncBtn").click(function() {
    on_inc_btn_clicked($("#KeywordNum"));
});

$("#MainSentenceNumDecBtn").click(function() {
    on_dec_btn_clicked($("#MainSentenceNum"));
});

$("#MainSentenceNumIncBtn").click(function() {
    on_inc_btn_clicked($("#MainSentenceNum"));
});

$("#Submit-Btn").click(function () {
    function lock(current) {
        disableSpinnerBtn(current);
        $("input[name=LoadTextOption]").attr("disabled", true);
        $("#BID").attr("disabled", true);
        $("#Text").attr("disabled", true);
        $("#KeywordModelVersion").attr("disabled", true);
        $("#KeywordNum").attr("disabled", true);
        $("#MainSentenceModelVersion").attr("disabled", true);
        $("#MainSentenceNum").attr("disabled", true);

        $("#ResultCell-Success").addClass("d-none");
        $("#ResultCell-Failed").addClass("d-none");
        $("#KeywordCell div.cell-content").empty();
        $("#MainSentenceCell div.cell-content").empty();
        $("#NERCell div.cell-content div.summary").empty();
        $("#NERCell div.cell-content div.word-cloud").empty();

        $("#NERCell div.cell-content div.filter div.options input[type=checkbox]").prop("checked", false);
    }

    function unlock(current) {
        enableSpinnerBtn(current);
        $("input[name=LoadTextOption]").attr("disabled", false);
        if($("input[name=LoadTextOption]:checked").val() == "1") $("#BID").attr("disabled", false);
        $("#Text").attr("disabled", false);
        $("#KeywordModelVersion").attr("disabled", false);
        $("#KeywordNum").attr("disabled", false);
        $("#MainSentenceModelVersion").attr("disabled", false);
        $("#MainSentenceNum").attr("disabled", false);
    }

    // lock
    lock($(this));

    // load data
    var bid = getBID();

    var text = $("#Text").val();
    if(text === undefined || text.length == 0){
        alert("Text가 입력되지 않았습니다.");
        unlock($(this));
        return;
    }

    var keyword_num = Number($("#KeywordNum").val());
    if(keyword_num === NaN) {
        $("#KeywordNum").val(5);
        keyword_num = 5;
    } else if (keyword_num < 1) {
        $("#KeywordNum").val(1);
        keyword_num = 1;
    }

    var keyword_model_ver = $("#KeywordModelVersion option:selected").val();
    
    var main_sentence_num = Number($("#MainSentenceNum").val());
    if(keyword_num === NaN) {
        $("#MainSentenceNum").val(5);
        main_sentence_num = 5;
    } else if (keyword_num < 1) {
        $("#MainSentenceNum").val(1);
        main_sentence_num = 1;
    }

    var main_sentence_model_ver = $("#MainSentenceModelVersion option:selected").val();

    // ajax
    $.ajax({
        url: "/api/keyword-ext",
        method: "POST",
        data: {
            bid: bid,
            text: text,
            keyword_model_ver: keyword_model_ver,
            keyword_num: keyword_num,
            main_sentence_model_ver: main_sentence_model_ver,
            main_sentence_num: main_sentence_num
        },
        context: this,
        success: function (data) {
            $("#ResultCell-Success").removeClass("d-none");

            var target = $("#KeywordCell div.cell-content");
            for(var item of data["keywords"]) {
                target.append(get_keyword_html(item["kid"], item["keyword"], item["good_count"], item["bad_count"]));
            }

            var target = $("#MainSentenceCell div.cell-content");
            for(var item of data["main_sentences"]) {
                target.append(get_main_sentence_html(item["sid"], item["main_sentence"], item["good_count"], item["bad_count"]));
            }

            $("#NERCell div.cell-content div.summary").html(get_ner_summary_html(data["word_tags"]));

            var target = $("#NERCell div.cell-content div.word-cloud");
            for(var item of data["word_tags"]) {
                target.append(get_ner_wordcloud_html(item["word"], item["tags"]));
            }
        },
        error: function () {
            $("#ResultCell-Failed").removeClass("d-none");
        },
        complete: function () {
            unlock($(this));
        }
    })
});

$("#Keyword-Eval-Submit-Btn").click(function() {
    function lock(current) {
        disableSpinnerBtn(current);
        $("input[name=LoadTextOption]").attr("disabled", true);
        $("#BID").attr("disabled", true);
        $("#Text").attr("disabled", true);
        $("#KeywordModelVersion").attr("disabled", true);
        $("#KeywordNum").attr("disabled", true);
        $("#MainSentenceModelVersion").attr("disabled", true);
        $("#MainSentenceNum").attr("disabled", true);
        $("#KeywordCell div.keyword div.btn-group input.eval").attr("disabled", true);
    }

    function unlock(current) {
        enableSpinnerBtn(current);
        $("input[name=LoadTextOption]").attr("disabled", false);
        if($("input[name=LoadTextOption]:checked").val() == "1") $("#BID").attr("disabled", false);
        $("#Text").attr("disabled", false);
        $("#KeywordModelVersion").attr("disabled", false);
        $("#KeywordNum").attr("disabled", false);
        $("#MainSentenceModelVersion").attr("disabled", false);
        $("#MainSentenceNum").attr("disabled", false);
        $("#KeywordCell div.keyword div.btn-group input.eval").attr("disabled", false);
    }

    lock($(this));

    var evals = [];
    var quit = false;
    $("#KeywordCell div.keyword").each(function(idx, item) {
        var kid = $(this).children("input.kid").val();
        var eval = Number($(this).find(`div.btn-group input.eval:checked`).val());

        if(kid === undefined || kid == -1){
            alert("kid에 오류가 있습니다.");
            quit = true;
            return false;
        }

        if(eval === undefined || ![1, -1].includes(eval)){
            alert("모든 평가가 입력되지 않았습니다.");
            quit = true;
            return false;
        }

        evals.push({
            kid: kid,
            eval: eval 
        });
    });

    if (quit) {
        unlock($(this));
        return;
    }

    $.ajax({
        url: "/api/keyword-eval",
        method: "POST",
        data: {
            evals: evals
        },
        context: this,
        success: function (data) {
            alert("등록 완료");
        },
        error: function () {
            alert("등록 실패");
        },
        complete: function () {
            unlock($(this));
        }
    })
});

$("#Main-Sentence-Eval-Submit-Btn").click(function() {
    function lock(current) {
        disableSpinnerBtn(current);
        $("input[name=LoadTextOption]").attr("disabled", true);
        $("#BID").attr("disabled", true);
        $("#Text").attr("disabled", true);
        $("#KeywordModelVersion").attr("disabled", true);
        $("#KeywordNum").attr("disabled", true);
        $("#MainSentenceModelVersion").attr("disabled", true);
        $("#MainSentenceNum").attr("disabled", true);
        $("#MainSentenceCell div.main-sentence div.btn-group input.eval").attr("disabled", true);
    }

    function unlock(current) {
        enableSpinnerBtn(current);
        $("input[name=LoadTextOption]").attr("disabled", false);
        if($("input[name=LoadTextOption]:checked").val() == "1") $("#BID").attr("disabled", false);
        $("#Text").attr("disabled", false);
        $("#KeywordModelVersion").attr("disabled", false);
        $("#KeywordNum").attr("disabled", false);
        $("#MainSentenceModelVersion").attr("disabled", false);
        $("#MainSentenceNum").attr("disabled", false);
        $("#MainSentenceCell div.main-sentence div.btn-group input.eval").attr("disabled", false);
    }

    lock($(this));

    var evals = [];
    var quit = false;
    $("#MainSentenceCell div.main-sentence").each(function(idx, item) {
        var sid = $(this).children("input.sid").val();
        var eval = Number($(this).find(`div.btn-group input.eval:checked`).val());

        if(sid === undefined || sid == -1){
            alert("sid에 오류가 있습니다.");
            quit = true;
            return false;
        }

        if(eval === undefined || ![1, -1].includes(eval)){
            alert("모든 평가가 입력되지 않았습니다.");
            quit = true;
            return false;
        }

        evals.push({
            sid: sid,
            eval: eval 
        });
    });

    if (quit) {
        unlock($(this));
        return;
    }

    $.ajax({
        url: "/api/main-sentence-eval",
        method: "POST",
        data: {
            evals: evals
        },
        context: this,
        success: function (data) {
            alert("등록 완료");
        },
        error: function () {
            alert("등록 실패");
        },
        complete: function () {
            unlock($(this));
        }
    })
});

$("#NER-Tag-Reset-Btn").click(function() {
    $("#NERCell div.cell-content div.filter div.options input[type=checkbox]").prop("checked", false);

    ner_wordcloud_filter_apply();
})

$("#NERCell div.cell-content div.filter div.options input[type=checkbox]").change(function() {
    ner_wordcloud_filter_apply();
})