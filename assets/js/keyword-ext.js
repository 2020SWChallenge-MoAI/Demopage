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
        },
        success: function (data) {
            $("#ResultCell-Success").removeClass("d-none");

            $("#Keyword").text(data.keywords.join('\n'));
            $("#MainSentence").text(data.main_sentences.join('\n'));
            
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