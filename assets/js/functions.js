function disableSpinnerBtn(target) {
    $("button").attr("disabled", true);
    target.children(".btn-text").addClass("d-none");
    target.children(".spinner-border").removeClass("d-none");
    target.children(".spinner-text").removeClass("d-none");
}

function enableSpinnerBtn(target) {
    $("button").attr("disabled", false);
    target.children(".btn-text").removeClass("d-none");
    target.children(".spinner-border").addClass("d-none");
    target.children(".spinner-text").addClass("d-none");
}