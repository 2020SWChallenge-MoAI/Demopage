function get_keyword_html(kid, keyword) {
    var html = `<div class="input-group keyword">
    <input type="text" class="form-control border border-dark" value="${keyword}" disabled>
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

function get_main_sentence_html(sid, main_sentence) {
    var html = `<div class="input-group main-sentence">
    <input type="text" class="form-control border border-dark" value="${main_sentence}" disabled>
    <input type="hidden" class="sid" value="${sid}">
    <div class="input-group-append btn-group btn-group-toggle d-flex" data-toggle="buttons">
        <label class="btn btn-outline-primary flex-even">
            <input type="radio" name="keyword-${sid}-eval" value="1"><i class="far fa-thumbs-up"></i>
        </label>
        <label class="btn btn-outline-danger flex-even">
            <input type="radio" name="keyword-${sid}-eval" value="-1"><i class="far fa-thumbs-down"></i>
        </label>
    </div>   
</div>`;

    return html;
}

$("#Submit-Btn").click(function () {
    var text = $("#Text").val();
    if(text === undefined || text.length == 0){
        alert("Text가 입력되지 않았습니다.");
        return;
    }

    $.ajax({
        url: "/api/keyword-ext",
        method: "POST",
        data: {
            text: text
        },
        context: this,
        beforeSend: function () {
            disableSpinnerBtn($(this));
            $("#Text").attr("disabled", true);
            $("#ResultCell-Success").addClass("d-none");
            $("#GroundTruthKeywordCell").addClass("d-none");
            $("#GroundTruthMainSentenceCell").addClass("d-none");
            $("#KeywordAccuracyCell").addClass("d-none");
            $("#MainSentenceAccuracyCell").addClass("d-none");
            $("#ResultCell-Failed").addClass("d-none");

            $("#KeywordCell div.cell-content").html("");
            $("#MainSentenceCell div.cell-content").html("");
        },
        success: function (data) {
            $("#ResultCell-Success").removeClass("d-none");

            var target = $("#KeywordCell div.cell-content");
            for(var item of data["keywords"]) {
                target.append(get_keyword_html(item["kid"], item["keyword"]));
            }

            var target = $("#MainSentenceCell div.cell-content");
            for(var item of data["main_sentences"]) {
                target.append(get_main_sentence_html(item["sid"], item["main_sentence"]));
            }
            
            if(data.has_ground_truth == true) {
                $("#GroundTruthKeywordCell").removeClass("d-none");
                $("#GroundTruthMainSentenceCell").removeClass("d-none");
                $("#KeywordAccuracyCell").removeClass("d-none");
                $("#MainSentenceAccuracyCell").removeClass("d-none");

                $("#GroundTruthKeyword").text(data.ground_truth.keywords.join('\n'));
                $("#GroundTruthMainSentence").text(data.ground_truth.main_sentences.join('\n'));
                $("#KeywordAccuracy").val(data.keyword_accuracy);
                $("#MainSentenceAccuracy").val(data.main_sentence_accuracy);
            }
        },
        error: function () {
            $("#ResultCell-Failed").removeClass("d-none");
        },
        complete: function () {
            enableSpinnerBtn($(this));
            $("#Text").attr("disabled", false);
        }

    })
});

$("#Keyword-Eval-Submit-Btn").click(function() {
    disableSpinnerBtn($(this));
    $("#Text").attr("disabled", true);
    $("#KeywordCell div.keyword div.btn-group input.eval").attr("disabled", true);

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
        enableSpinnerBtn($(this));
        $("#Text").attr("disabled", false);
        $("#KeywordCell div.keyword div.btn-group input.eval").attr("disabled", false);
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
            enableSpinnerBtn($(this));
            $("#Text").attr("disabled", false);
            $("#KeywordCell div.keyword div.btn-group input.eval").attr("disabled", false);
        }

    })
});