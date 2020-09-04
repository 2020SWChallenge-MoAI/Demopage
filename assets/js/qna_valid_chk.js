$("input:radio[name=QType]").click(function () {
    $(".u-ans-cell").addClass("d-none");

    var checked_val = $("input[name=QType]:checked").val();
    var target;
    switch (checked_val) {
        //case "0":
        //target = $("#UAnsCell-OX");
        //break;
        case "1":
            target = $("#UAnsCell-Choice");
            break;
        case "2":
            target = $("#UAnsCell-ShortAnswer");
            break;
    }

    target.removeClass("d-none");
    $("#QType").val(checked_val);
});

$("#LoadRandQA-Matched-Btn").click(function () {
    var bid = $("#BID").val();
    var qtype = $("#QType").val();

    $.ajax({
        url: "/api/data/" + bid + "/" + qtype + "/randmatched",
        method: "GET",
        context: this,
        beforeSend: function () {
            disableSpinnerBtn($(this));
        },
        success: function (data) {
            $("#Question").val(data.q);
            $("#QAID").val(data.qaid);
            $("#QType2").val(qtype);
            $("#TrueAnswer").val(data.a);

            if (qtype == 1) { //객관식
                $("#UAns-Choice-1-Text").val(data.choices[0]);
                $("#UAns-Choice-2-Text").val(data.choices[1]);
                $("#UAns-Choice-3-Text").val(data.choices[2]);
                $("#UAns-Choice-4-Text").val(data.choices[3]);
                $("#UAns-Choice-" + data.a).attr("checked", true);
            } else if (qtype == 2) { //주관식
                $("#UAns-ShortAnswer").val(data.a);
            }
        },
        error: function () {
            $("#Question").val("Error");
            $("#QAID").val(-1);
            $("#QType2").val(qtype);
            $("#TrueAnswer").val(-1);

            if (qtype == 1) { //객관식
                $("#UAns-Choice-1-Text").val("");
                $("#UAns-Choice-2-Text").val("");
                $("#UAns-Choice-3-Text").val("");
                $("#UAns-Choice-4-Text").val("");
                $("#UAns-Choice-1").attr("checked", false);
                $("#UAns-Choice-2").attr("checked", false);
                $("#UAns-Choice-3").attr("checked", false);
                $("#UAns-Choice-4").attr("checked", false);
            } else if (qtype == 2) { //주관식
                $("#UAns-ShortAnswer").val("");
            }
        },
        complete: function () {
            enableSpinnerBtn($(this));
        }
    });
});

$("#LoadRandQA-Unmatched-Btn").click(function () {
    var bid = $("#BID").val();
    var qtype = $("#QType").val();

    $.ajax({
        url: "/api/data/" + bid + "/" + qtype + "/randunmatched",
        method: "GET",
        context: this,
        beforeSend: function () {
            disableSpinnerBtn($(this));
        },
        success: function (data) {
            $("#Question").val(data.q);
            $("#QAID").val(data.qaid);
            $("#QType2").val(qtype);
            $("#TrueAnswer").val(-1);

            if (qtype == 1) { //객관식
                $("#UAns-Choice-1-Text").val(data.choices[0]);
                $("#UAns-Choice-2-Text").val(data.choices[1]);
                $("#UAns-Choice-3-Text").val(data.choices[2]);
                $("#UAns-Choice-4-Text").val(data.choices[3]);
                $("#UAns-Choice-" + data.a).attr("checked", true);
            } else if (qtype == 2) { //주관식
                $("#UAns-ShortAnswer").val(data.a);
            }
        },
        error: function () {
            $("#Question").val("Error");
            $("#QAID").val(-1);
            $("#QType2").val(qtype);
            $("#TrueAnswer").val(-1);

            if (qtype == 1) { //객관식
                $("#UAns-Choice-1-Text").val("");
                $("#UAns-Choice-2-Text").val("");
                $("#UAns-Choice-3-Text").val("");
                $("#UAns-Choice-4-Text").val("");
                $("#UAns-Choice-1").attr("checked", false);
                $("#UAns-Choice-2").attr("checked", false);
                $("#UAns-Choice-3").attr("checked", false);
                $("#UAns-Choice-4").attr("checked", false);
            } else if (qtype == 2) { //주관식
                $("#UAns-ShortAnswer").val("");
            }
        },
        complete: function () {
            enableSpinnerBtn($(this));
        }
    });
});

$("#Question, #UAns-Choice-1-Text, #UAns-Choice-2-Text, #UAns-Choice-3-Text, #UAns-Choice-4-Text, #UAns-ShortAnswer").on("change keyup paste", function() {
    $("#TrueAnswer").val(-1);
});

$("#Submit-Btn").click(function () {
    var text = $("#Text").val();
    if(text === undefined || text.length == 0){
        return;
    }

    var qtype = $("#QType").val();
    if(qtype === undefined || ![1, 2].includes(Number(qtype))) {
        return;
    }

    var question = $("#Question").val();
    if(question === undefined || question.length == 0) {
        return;
    }

    var choices = [];
    var answer;
    if(qtype == 1) { //객관식
        for(var i = 1; i <= 4; i++) {
            var choice = $("#UAns-Choice-" + i + "-Text").val();
            if(choice === undefined || choice.length == 0) {
                return;
            }

            choices.push(choice);
        }
        answer = $("input:radio[name=UAns-Choice]:checked").val();
        if(answer === undefined || ![1, 2, 3, 4].includes(Number(answer))) {
            return;
        }
    } else if (qtype == 2) { //주관식
        answer = $("#UAns-ShortAnswer").val();
        if(answer === undefined || answer.length == 0) {
            return;
        }
    }

    $.ajax({
        url: "/api/qna-valid-chk",
        method: "POST",
        data: {
            text: text,
            qtype: qtype,
            question: question,
            choices: choices,
            answer: answer
        },
        context: this,
        beforeSend: function () {
            disableSpinnerBtn($(this));
            $("#Text").attr("disabled", true);
            $("input:radio[name=QType]").attr("disabled", true);
            $("#Question").attr("disabled", true);
            $("input:radio[name=UAns-Choice]").attr("disabled", true);
            $("#UAns-Choice-1-Text").attr("disabled", true);
            $("#UAns-Choice-2-Text").attr("disabled", true);
            $("#UAns-Choice-3-Text").attr("disabled", true);
            $("#UAns-Choice-4-Text").attr("disabled", true);
            $("#UAns-ShortAnswer").attr("disabled", true);
            $("#ResultCell-Success").addClass("d-none");
            $("#GroundAnsCell").addClass("d-none");
            $("#ResultCell-Failed").addClass("d-none");
        },
        success: function (data) {
            $("#ResultCell-Success").removeClass("d-none");
            $("#BAns").val(data.bert_answer);
            $("#BConfidence").val(data.confidence);
            $("#BSimilarity").val(data.similarity);

            var true_answer = $("#TrueAnswer").val();
            if(true_answer != -1) {
                $("#GAnsCell").removeClass("d-none");
                $("#GAns").val(true_answer);
            }            
        },
        error: function () {
            $("#ResultCell-Failed").removeClass("d-none");
        },
        complete: function () {
            enableSpinnerBtn($(this));
            $("#Text").attr("disabled", false);
            $("input:radio[name=QType]").attr("disabled", false);
            $("#Question").attr("disabled", false);
            $("input:radio[name=UAns-Choice]").attr("disabled", false);
            $("#UAns-Choice-1-Text").attr("disabled", false);
            $("#UAns-Choice-2-Text").attr("disabled", false);
            $("#UAns-Choice-3-Text").attr("disabled", false);
            $("#UAns-Choice-4-Text").attr("disabled", false);
            $("#UAns-ShortAnswer").attr("disabled", false);
        }

    })
});