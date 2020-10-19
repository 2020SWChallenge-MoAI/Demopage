$("#LeftArea div.load-text-control div.radio-btns").click(function() {
    if($("#LoadTextOption-ByRandom").is(":checked")) {
        $("#BID").attr("disabled", true);
    } else if($("#LoadTextOption-ByBID").is(":checked")) {
        $("#BID").attr("disabled", false);
    }
})

$("#LoadText-Btn").click(function() {
    function lock(current) {
        disableSpinnerBtn(current);
        $("input[name=LoadTextOption]").attr("disabled", true);
        $("#BID").attr("disabled", true);
        $("#Text").attr("disabled", true);

        $("#ResultCell-Success").addClass("d-none");
        $("#ResultCell-Failed").addClass("d-none");
    }

    function unlock(current) {
        enableSpinnerBtn(current);
        $("#Text").attr("disabled", false);
        $("input[name=LoadTextOption]").attr("disabled", false);
        if(!$("#LoadTextOption-ByRandom").is(":checked")) $("#BID").attr("disabled", false);
    }

    // Lock
    lock($(this));

    // load bid
    var bid;
    if($("#LoadTextOption-ByRandom").is(":checked")) {
        bid = -1;
    } else if ($("#LoadTextOption-ByBID").is(":checked")) {
        bid = getBID();
        if(bid === -1) {
            alert("Invalid BID");
            unlock($(this));
            return;
        }
    }
    
    // ajax
    $.ajax({
        url: `/api/data/loadtext?bid=${bid}`,
        method: "GET",
        context: this,
        success: function(data) {
            $("#Text").val(data.text);
            $("#BID").val(data.bid);
        },
        error: function() {
            $("#Text").val("Error");
            $("#BID").val("");
        },
        complete: function() {
            unlock($(this));
        }
    })
});

$("#Text").on("change keyup paste", function() {
    $("#BID").val("");
});

$("#BID").keydown(function(key) {
    if(key.keyCode == 13) {
        $("#LoadText-Btn").trigger("click");
    }
})

function getBID() {
    var bid = $("#BID").val();

    if(bid === "") bid = -1;
    else bid = Number(bid);
    
    if(bid === NaN) bid = -1;

    return bid;
}