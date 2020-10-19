function get_keyword_html(kid, keyword, good_count, bad_count) {
    var html = `<div class="input-group keyword">
    <input type="text" class="form-control border border-dark" value="${keyword.word} [${Number(keyword.weight).toFixed(3)}] [${good_count}/${bad_count}]" disabled>
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
    var ner_class = `word-tag dominant-tag-${Object.keys(tags)[0].split("-")[0]}`;
    var ner_word_tags = `${word}`;
    for(var tag of Object.keys(tags)) {
        ner_class += ` tag-${tag.split("-")[0]}`;
        ner_word_tags += ` [${tag}(${tags[tag]})]`;
    }

    var html = `<span class="${ner_class}">${ner_word_tags}</span>`;

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
        BDY: 0,
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
        "PLT",
        "BDY",
    ];
    
    var is_checked = false;
    for(var tag of tags) {
        if($(`#NERCell div.cell-content div.filter div.options input[type=checkbox]#NER-Tag-${tag}`).prop("checked") == true) {
            is_checked = true;
        }    
    }
    
    if(is_checked == false) {
        $(`#NERCell div.cell-content div.word-cloud span.word-tag`).removeClass("d-none");
        return;
    }

    $(`#NERCell div.cell-content div.word-cloud span.word-tag`).addClass("d-none");

    for(var tag of tags) {
        if($(`#NERCell div.cell-content div.filter div.options input[type=checkbox]#NER-Tag-${tag}`).prop("checked") == true) {
            $(`#NERCell div.cell-content div.word-cloud span.word-tag.tag-${tag}`).removeClass("d-none");
        }
    }
}

function get_etri_ner_wordcloud_html(word, tags) {
    var ner_class = `word-tag dominant-tag-${Object.keys(tags)[0].substring(0, 2)}`;
    var ner_word_tags = `${word}`;
    for(var tag of Object.keys(tags)) {
        ner_class += ` tag-${tag.substring(0, 2)}`;
        ner_word_tags += ` [${tag}(${tags[tag]})]`;
    }

    var html = `<span class="${ner_class}">${ner_word_tags}</span>`;

    return html;
}

function get_etri_ner_summary_html(data) {
    var result = {
        PS: 0,
        LC: 0,
        OG: 0,
        AF: 0,
        DT: 0,
        TI: 0,
        CV: 0,
        AM: 0,
        PT: 0,
        QT: 0,
        FD: 0,
        TR: 0,
        EV: 0,
        MT: 0,
        TM: 0,
    };

    var total = 0;

    for(var word_tag of data) {
        for(var tag of Object.keys(word_tag["tags"])) {
            result[tag.substring(0, 2)] += word_tag["tags"][tag];
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

function etri_ner_wordcloud_filter_apply() {
    var tags = [
        "PS",
        "LC",
        "OG",
        "AF",
        "DT",
        "TI",
        "CV",
        "AM",
        "PT",
        "QT",
        "FD",
        "TR",
        "EV",
        "MT",
        "TM",
    ];
    
    var is_checked = false;
    for(var tag of tags) {
        if($(`#ETRINERCell div.cell-content div.filter div.options input[type=checkbox]#ETRI-NER-Tag-${tag}`).prop("checked") == true) {
            is_checked = true;
        }    
    }
    
    if(is_checked == false) {
        $(`#ETRINERCell div.cell-content div.word-cloud span.word-tag`).removeClass("d-none");
        return;
    }

    $(`#ETRINERCell div.cell-content div.word-cloud span.word-tag`).addClass("d-none");

    for(var tag of tags) {
        if($(`#ETRINERCell div.cell-content div.filter div.options input[type=checkbox]#ETRI-NER-Tag-${tag}`).prop("checked") == true) {
            $(`#ETRINERCell div.cell-content div.word-cloud span.word-tag.tag-${tag}`).removeClass("d-none");
        }
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

$("#ToggleLeftAreaBtn").click(function() {
    var target = $("#LeftArea");
    if(target.hasClass("d-none")) {
        target.removeClass("d-none");
        $(this).html(`<i class="fas fa-chevron-left"></i>`);
        $("#LeftRightAreaContainer").css("grid-template-columns", "1fr auto 1fr");
    } else {
        target.addClass("d-none");
        $(this).html(`<i class="fas fa-chevron-right"></i>`);
        $("#LeftRightAreaContainer").css("grid-template-columns", "auto 1fr");
    }
})

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
        $("#ETRINERCell div.cell-content div.summary").empty();
        $("#ETRINERCell div.cell-content div.word-cloud").empty();

        $("#NERCell div.cell-content div.filter div.options input[type=checkbox]").prop("checked", false);
        $("#ETRINERCell div.cell-content div.filter div.options input[type=checkbox]").prop("checked", false);
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

    var keyword_history = $("#KeywordHistory").val();

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
            keyword_history: keyword_history,
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

            $("#ETRINERCell div.cell-content div.summary").html(get_etri_ner_summary_html(data["etri_word_tags"]));

            var target = $("#ETRINERCell div.cell-content div.word-cloud");
            for(var item of data["etri_word_tags"]) {
                target.append(get_etri_ner_wordcloud_html(item["word"], item["tags"]));
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
        $("#KeywordHistory").attr("disabled", true);
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
        $("#KeywordHistory").attr("disabled", false);
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

$("#ToggleNERSummaryBtn").click(function() {
    var target = $("#NERCell div.summary");
    if(target.hasClass("d-none")) {
        target.removeClass("d-none");
        $(this).css("color", "black");
    } else {
        target.addClass("d-none");
        $(this).css("color", "lightgray");
    }
})

$("#ToggleNERFilterBtn").click(function() {
    var target = $("#NERCell div.filter");
    if(target.hasClass("d-none")) {
        target.removeClass("d-none");
        $(this).css("color", "black");
    } else {
        target.addClass("d-none");
        $(this).css("color", "lightgray");
    }
})

$("#ETRI-NER-Tag-Reset-Btn").click(function() {
    $("#ETRINERCell div.cell-content div.filter div.options input[type=checkbox]").prop("checked", false);

    etri_ner_wordcloud_filter_apply();
})

$("#ETRINERCell div.cell-content div.filter div.options input[type=checkbox]").change(function() {
    etri_ner_wordcloud_filter_apply();
})

$("#ToggleETRINERSummaryBtn").click(function() {
    var target = $("#ETRINERCell div.summary");
    if(target.hasClass("d-none")) {
        target.removeClass("d-none");
        $(this).css("color", "black");
    } else {
        target.addClass("d-none");
        $(this).css("color", "lightgray");
    }
})

$("#ToggleETRINERFilterBtn").click(function() {
    var target = $("#ETRINERCell div.filter");
    if(target.hasClass("d-none")) {
        target.removeClass("d-none");
        $(this).css("color", "black");
    } else {
        target.addClass("d-none");
        $(this).css("color", "lightgray");
    }
})