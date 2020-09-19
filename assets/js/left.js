$("#LoadRandText-Btn").click(function() {
    $.ajax({
        url: "/api/data/randtext",
        method: "GET",
        context: this,
        beforeSend: function() {
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
        success: function(data) {
            $("#Text").val(data.text);
            $("#BID").val(data.bid);
        },
        error: function() {
            $("#Text").val("Error");
            $("#BID").val(-1);
        },
        complete: function() {
            enableSpinnerBtn($(this));
            $("#Text").attr("disabled", false);
        }
    })
});

$("#Text").on("change keyup paste", function() {
    $("#BID").val(-1);
});