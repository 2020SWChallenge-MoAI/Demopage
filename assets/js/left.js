$("#LoadRandText-Btn").click(function() {
    $.ajax({
        url: "/api/data/randtext",
        method: "GET",
        context: this,
        beforeSend: function() {
            disableSpinnerBtn($(this));
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
        }
    })
});

$("#Text").on("change keyup paste", function() {
    $("#BID").val(-1);
});