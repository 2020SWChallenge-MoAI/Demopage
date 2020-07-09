$("input:radio[name=QType]").click(function () {
    $(".u-ans-cell").addClass("d-none");

    var checked_val = $("input[name=QType]:checked").val();
    var target;
    switch (checked_val) {
        case "0":
            target = $("#UAnsCell-OX");
            break;
        case "1":
            target = $("#UAnsCell-Choice");
            break;
        case "2":
            target = $("#UAnsCell-ShortAnswer");
            break;
    }

    target.removeClass("d-none");
});

function disableSpinnerBtn(target) {
    target.attr("disabled", true);
    target.children(".btn-text").addClass("d-none");
    target.children(".spinner-border").removeClass("d-none");
    target.children(".spinner-text").removeClass("d-none");
}

function enableSpinnerBtn(target) {
    target.attr("disabled", false);
    target.children(".btn-text").removeClass("d-none");
    target.children(".spinner").addClass("d-none");
}

$("#LoadRandText-Btn").click(function() {
    disableSpinnerBtn($(this));
})

$("#LoadRandQA-Matched-Btn").click(function() {
    disableSpinnerBtn($(this));
})

$("#LoadRandQA-Unmatched-Btn").click(function() {
    disableSpinnerBtn($(this));
})

$("#Submit-Btn").click(function() {
    disableSpinnerBtn($(this));
})