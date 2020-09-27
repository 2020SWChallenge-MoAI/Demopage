function get_word_html(word) {
    var html = `<div class="row word-cell" id="Word-${word["wid"]}">
    <div class="col word">
        <input type="text" class="form-control" value="${word["word"]}" disabled>
    </div>
    <div class="col tag">
        <input type="text" class="form-control" value="${word["tag"]}" disabled>
    </div>
    <div class="col correct-tag">
        <select class="form-control">
            <option value="TRM-B"${(word["tag"] == "TRM-B") ? " selected" : ""}>TERM_BEGIN : 의학 용어, IT관련 용어 등 일반 용어를 총칭</option>
            <option value="TRM-I"${(word["tag"] == "TRM-I") ? " selected" : ""}>TERM_INSIDE : 의학 용어, IT관련 용어 등 일반 용어를 총칭</option>
            <option value="LOC-B"${(word["tag"] == "LOC-B") ? " selected" : ""}>LOCATION_BEGIN : 지역명칭과 행정구역 명칭 등</option>
            <option value="LOC-I"${(word["tag"] == "LOC-I") ? " selected" : ""}>LOCATION_INSIDE : 지역명칭과 행정구역 명칭 등</option>
            <option value="CVL-B"${(word["tag"] == "CVL-B") ? " selected" : ""}>CIVILIZATION_BEGIN : 문명 및 문화에 관련된 용어</option>
            <option value="CVL-I"${(word["tag"] == "CVL-I") ? " selected" : ""}>CIVILIZATION_INSIDE : 문명 및 문화에 관련된 용어</option>
            <option value="ANM-B"${(word["tag"] == "ANM-B") ? " selected" : ""}>ANIMAL_BEGIN : 동물</option>
            <option value="ANM-I"${(word["tag"] == "ANM-I") ? " selected" : ""}>ANIMAL_INSIDE : 동물</option>
            <option value="ORG-B"${(word["tag"] == "ORG-B") ? " selected" : ""}>ORGANIZATION_BEGIN : 기관 및 단체와 회의/회담을 모두 포함</option>
            <option value="ORG-I"${(word["tag"] == "ORG-I") ? " selected" : ""}>ORGANIZATION_INSIDE : 기관 및 단체와 회의/회담을 모두 포함</option>
            <option value="EVT-B"${(word["tag"] == "EVT-B") ? " selected" : ""}>EVENT_BEGIN : 특정 사건 및 사고 명칭과 행사 등</option>
            <option value="EVT-I"${(word["tag"] == "EVT-I") ? " selected" : ""}>EVENT_INSIDE : 특정 사건 및 사고 명칭과 행사 등</option>
            <option value="DAT-B"${(word["tag"] == "DAT-B") ? " selected" : ""}>DATE_BEGIN : 날짜</option>
            <option value="DAT-I"${(word["tag"] == "DAT-I") ? " selected" : ""}>DATE_INSIDE : 날짜</option>
            <option value="NUM-B"${(word["tag"] == "NUM-B") ? " selected" : ""}>NUMBER_BEGIN : 숫자</option>
            <option value="NUM-I"${(word["tag"] == "NUM-I") ? " selected" : ""}>NUMBER_INSIDE : 숫자</option>
            <option value="PER-B"${(word["tag"] == "PER-B") ? " selected" : ""}>PERSON_BEGIN : 인물 실존, 가상 등 인물명에 해당 하는 것</option>
            <option value="PER-I"${(word["tag"] == "PER-I") ? " selected" : ""}>PERSON_INSIDE : 인물 실존, 가상 등 인물명에 해당 하는 것</option>
            <option value="TIM-B"${(word["tag"] == "TIM-B") ? " selected" : ""}>TIME_BEGIN : 시간</option>
            <option value="TIM-I"${(word["tag"] == "TIM-I") ? " selected" : ""}>TIME_INSIDE : 시간</option>
            <option value="AFW-B"${(word["tag"] == "AFW-B") ? " selected" : ""}>ARTIFACTS WORKS_BEGIN : 인공물로 사람에 의해 창조된 대상물</option>
            <option value="AFW-I"${(word["tag"] == "AFW-I") ? " selected" : ""}>ARTIFACTS WORKS_INSIDE : 인공물로 사람에 의해 창조된 대상물</option>
            <option value="FLD-B"${(word["tag"] == "FLD-B") ? " selected" : ""}>STUDY FIELD_BEGIN : 학문 분야 및 이론, 법칙, 기술 등</option>
            <option value="FLD-I"${(word["tag"] == "FLD-I") ? " selected" : ""}>STUDY FIELD_INSIDE : 학문 분야 및 이론, 법칙, 기술 등</option>
            <option value="MAT-B"${(word["tag"] == "MAT-B") ? " selected" : ""}>MATERIAL_BEGIN : 물질; 금속, 암석, 화학물질 등</option>
            <option value="MAT-I"${(word["tag"] == "MAT-I") ? " selected" : ""}>MATERIAL_INSIDE : 물질; 금속, 암석, 화학물질 등</option>
            <option value="PLT-B"${(word["tag"] == "PLT-B") ? " selected" : ""}>PLANT_BEGIN : 식물</option>
            <option value="PLT-I"${(word["tag"] == "PLT-I") ? " selected" : ""}>PLANT_INSIDE : 식물</option>
            <option value="O"${(word["tag"] == "O") ? " selected" : ""}>분류 불가</option>
        </select>
    </div>
</div>`
    
    return html;
}

function get_ner_html(sentence) {
    var html = `<div class="row">
    <div class="col">Word</div>
    <div class="col">Tag</div>
    <div class="col">Correct Tag</div>
</div>`;

    for (var word of sentence["words"]) {
        html += get_word_html(word);
    }

    return html;
}

$("#Submit-Btn").click(function() {
    var bid = Number($("#BID").val());
    if (bid === NaN) {
        bid = -1;
    }

    var text = $("#Text").val();
    if(text === undefined || text.length == 0){
        alert("Text가 입력되지 않았습니다.");
        return;
    }

    $.ajax({
        url: "/api/ner",
        method: "POST",
        data: {
            bid: bid,
            text: text
        },
        context: this,
        beforeSend: function () {
            disableSpinnerBtn($(this));
            $("#Text").attr("disabled", true);
            $("#ResultCell-Success").addClass("d-none");
            $("#ResultCell-Failed").addClass("d-none");

            $("#Result").html("");
        },
        success: function (data) {
            $("#ResultCell-Success").removeClass("d-none");

            $("#Data").val(JSON.stringify(data["sentences"]));
            $("#CurSentenceIdx").val("0");

            $("#SentenceCell > div.cell-title > p").text(`개체명 (1/${data["sentences"].length})`);

            $("#Sentence").html(get_ner_html(data["sentences"][0]));
        },
        error: function () {
            $("#ResultCell-Failed").removeClass("d-none");
        },
        complete: function () {
            enableSpinnerBtn($(this));
            $("#Text").attr("disabled", false);
        }
    })
})

$("#Prev-Sentence-Btn").click(function() {
    var data = JSON.parse($("#Data").val());
    var total_sentence_num = data.length;
    var cur_sentence_idx = Number($("#CurSentenceIdx").val());

    if(cur_sentence_idx <= 0) {
        alert("처음입니다.");
        cur_sentence_idx = 0;
    } else if (cur_sentence_idx >= total_sentence_num) {
        cur_sentence_idx = total_sentence_num - 1;
    } else {
        cur_sentence_idx -= 1;
    }

    $("#CurSentenceIdx").val(cur_sentence_idx);
    $("#Sentence").html(get_ner_html(data[cur_sentence_idx]));
    $("#SentenceCell > div.cell-title > p").text(`개체명 (${cur_sentence_idx + 1}/${total_sentence_num})`);
})

$("#Next-Sentence-Btn").click(function() {
    var data = JSON.parse($("#Data").val());
    var total_sentence_num = data.length;
    var cur_sentence_idx = Number($("#CurSentenceIdx").val());

    if(cur_sentence_idx < 0) {
        cur_sentence_idx = 0;
    } else if (cur_sentence_idx >= total_sentence_num - 1) {
        alert("마지막입니다.");
        cur_sentence_idx = total_sentence_num - 1;
    } else {
        cur_sentence_idx += 1;
    }

    $("#CurSentenceIdx").val(cur_sentence_idx);
    $("#Sentence").html(get_ner_html(data[cur_sentence_idx]));
    $("#SentenceCell > div.cell-title > p").text(`개체명 (${cur_sentence_idx + 1}/${total_sentence_num})`);
})

$("#NER-Eval-Submit-Btn").click(function() {
    disableSpinnerBtn($(this));
    $("#Text").attr("disabled", true);
    $("div.word-cell select").attr("disabled", true);

    var sid = Number($("#CurSentenceIdx").val());

    var words = [];
    $("div.word-cell").each(function(idx, item) {
        var wid = Number($(this).attr("id").split("-")[1]);
        var tag = $(this).find("select option:selected").val();

        words.push({
            wid: wid,
            tag: tag
        })
    });

    $.ajax({
        url: "/api/ner-eval",
        method: "POST",
        data: {
            words: words
        },
        context: this,
        success: function (data) {
            alert(`Sentence ${sid + 1} 평가 등록 완료`);
            $("#Next-Sentence-Btn").trigger("click");
        },
        error: function () {
            alert(`Sentence ${sid + 1} 평가 등록 실패`);
        },
        complete: function () {
            enableSpinnerBtn($(this));
            $("#Text").attr("disabled", false);
            $("div.word-cell select").attr("disabled", false);
        }
    })
})