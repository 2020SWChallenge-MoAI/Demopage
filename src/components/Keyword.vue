<template>
<div id="keyword-component" :class="{hidden: (currentTabItem != 0)}">
    <div class="area" id="option-area">
        <p class="area-title" @click="toggleOption">옵션</p>
        <div class="area-content" :class="{hidden: !showOption}">
            <div class="option-item" id="keyword-num-option-item">
                <p class="option-item-title">키워드 개수</p>
                <div class="input-group option-item-content">
                    <p @click="decreaseKeywordNum" class="keyword-num-btn decrease-btn btn" :class="{deactivated: btnLock}"><i class="fas fa-chevron-down"></i></p>
                    <input type="number" v-model="keywordNum" class="input keyword-num-input" :disabled="btnLock">
                    <p @click="increaseKeywordNum" class="keyword-num-btn increase-btn btn" :class="{deactivated: btnLock}"><i class="fas fa-chevron-up"></i></p>
                </div>
            </div>
            <div class="option-item" id="init-keyword-option-item">
                <p class="option-item-title">시작 키워드</p>
                <div class="option-item-content">
                    <select v-model="initKeyword" :disabled="btnLock">
                        <option value="none">없음</option>
                        <option value="character">등장 인물</option>
                        <option value="location">배경</option>
                        <option value="event">사건</option>
                        <option value="custom">직접 입력</option>
                    </select>
                    <input type="text" v-model="initKeywordCustomInput" class="input option-item-content" :disabled="isInitKeywordCustomInputDisabled">

                </div>
            </div>
        </div>
    </div>
    <div class="submit-btn-area">
        <p class="submit-btn round-btn btn blue-btn" @click="submit" :class="{deactivated: btnLock}">AI 분석</p>
    </div>
    <div class="area" id="result-area" :class="{hidden: (keywordStatus == 0)}">
        <p class="area-title">분석 결과</p>
        <div class="area-content" :class="{success: (keywordStatus == 1), fail: (keywordStatus == -1)}">
            <div v-if="(keywordStatus == -1)">분석 실패</div>
            <div v-if="(keywordStatus == 1)">
                <div class="tfidf area">
                    <p class="area-title">TF-IDF + Co-occurrency</p>
                    <div class="area-content">
                        <p v-for="(keyword, index) in keywords.tfidf" :key="index">{{ keyword.word }} [{{ Number(keyword.weight).toFixed(3) }}]</p>
                    </div>
                </div>
                <div class="ner area">
                    <p class="area-title">NER<i class="far fa-list-alt icon" title="NER 요약 보기" :class="{deactivated: !ner_summary_show}" @click="toggleNerSummaryArea"></i><i class="far fa-check-square icon" title="NER 필터 보기" :class="{deactivated: !ner_filter_show}" @click="toggleNerFilterArea"></i></p>
                    <div class="area-content">
                        <div class="ner-summary" :class="{hidden: !ner_summary_show}">
                            <ul>
                                <li v-for="(item, i) in nerTagSummary['result']" :key="i">{{ getFullTagname(item["tag"]) }} : {{ item["count"] }} / {{ nerTagSummary["total"] }} = {{ Number(item["count"] / nerTagSummary["total"]).toFixed(3) }}</li>
                            </ul>
                        </div>
                        <div class="ner-filter" :class="{hidden: !ner_filter_show}">
                            <div class="ner-filter-ctrl-btns">
                                <p class="round-btn btn" @click="setAllNerFilter">모두 선택</p>
                                <p class="round-btn btn" @click="resetAllNerFilter">모두 해제</p>
                            </div>
                            <div class="ner-filter-checkboxs">
                                <div class="ner-filter-checkbox-item" v-for="tagname in nerTags" :key="tagname">
                                    <input type="checkbox" v-model="ner_filter[tagname]" :id="`ner-filter-checkbox-${tagname}`">
                                    <label :for="`ner-filter-checkbox-${tagname}`">{{ getFullTagname(tagname) }}</label>
                                </div>
                            </div>
                        </div>
                        <div class="word-tags">
                            <p class="word-tag" v-for="(word_tag, i) in keywords.ner" :key="i" :class="[`dominant-tag-${word_tag['tags'][0]['tag'].toLowerCase()}`, {hidden: !ner_filter[`${word_tag['tags'][0]['tag'].toLowerCase()}`]}]">{{ word_tag["word"] }}<span v-for="(tag_count, j) in word_tag['tags']" :key="j">[{{ tag_count["tag"] }}({{ tag_count["count"] }})]</span></p>
                        </div>
                    </div>
                </div>
                <div class="together area">
                    <p class="area-title">Together</p>
                    <div class="area-content">
                        <p v-for="(keyword, index) in keywords.together" :key="index">{{ keyword.word }} [{{ Number(keyword.weight).toFixed(3) }}]</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'KeywordComponent',
    props: {
        currentTabItem: Number,
        book: Object,
        btnLock: Boolean
    },
    data: function() {
        return {
            showOption: true,
            keywordNum: 10,
            initKeyword: "none",
            initKeywordCustomInput: "",
            keywords: {
                tfidf: [],
                ner: [],
                together: []
            },
            ner_filter: {
                af: true,
                am: true,
                am_body: true,
                cv: true,
                cv_pos: true,
                dt: true,
                ev: true,
                fd: true,
                lc: true,
                mt: true,
                qt: true,
                og: true,
                ps: true,
                pt: true,
                ti: true,
                tm: true,
                tr: true
            },
            keywordStatus: 0,  //0 : not analyzed, 1 : successfully analyzed, -1: fail to analyze
            ner_summary_show: false,
            ner_filter_show: false
        }
    },
    methods: {
        resetKeywords: function() {
            this.keywordStatus = 0;
            this.keywords = {
                tfidf: [],
                ner: [],
                together: []
            };
            this.ner_filter = {
                af: true,
                am: true,
                am_body: true,
                cv: true,
                cv_pos: true,
                dt: true,
                ev: true,
                fd: true,
                lc: true,
                mt: true,
                qt: true,
                og: true,
                ps: true,
                pt: true,
                ti: true,
                tm: true,
                tr: true
            };
            this.ner_summary_show = false;
            this.ner_filter_show = false;
        },
        toggleOption: function() {
            this.showOption = !this.showOption;
        },
        decreaseKeywordNum: function() {
            if(!this.btnLock) {
                if (this.keywordNum > 1) this.keywordNum--;
            }
        },
        increaseKeywordNum: function() {
            if(!this.btnLock) {
                this.keywordNum++;
            }
        },
        submit: async function() {
            if(!this.btnLock) {
                this.$emit("lock-btns");
                this.resetKeywords();

                let bid = this.book.bid;
                let content = this.book.content;
                let num = this.keywordNum;
                let initKeyword = this.initKeyword;
                let initKeywordCustomInput = this.initKeywordCustomInput;

                if (content.length == 0) {
                    alert("도서 내용이 비어 있습니다.");
                    this.$emit("unlock-btns");
                    return;
                }

                try {
                    let response = await fetch(`/apiserver/keyword`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            bid: bid,
                            content: content,
                            num: num,
                            initKeyword: initKeyword,
                            initKeywordCustomInput: initKeywordCustomInput
                        })
                    });

                    if (response.ok) {
                        this.keywords = await response.json();
                        this.keywordStatus = 1;
                    } else {
                        this.keywordStatus = -1;
                    }
                } catch(error) {
                    console.log(error);
                    this.keywordStatus = -1;
                }

                this.$emit("unlock-btns");
            }
        },
        getFullTagname: function(short_tagname) {
            switch(short_tagname) {
                case "af":
                    return "Artifact";
                case "am":
                    return "Animal";
                case "am_body":
                    return "Body Part";
                case "cv":
                    return "Civilization";
                case "cv_pos":
                    return "Position";
                case "dt":
                    return "Date";
                case "ev":
                    return "Event";
                case "fd":
                    return "Study Field";
                case "lc":
                    return "Location";
                case "mt":
                    return "Material";
                case "og":
                    return "Organization";
                case "ps":
                    return "Person";
                case "pt":
                    return "Plant";
                case "qt":
                    return "Number";
                case "ti":
                    return "Time";
                case "tm":
                    return "Term";
                case "tr":
                    return "Theory";
            }
        },
        toggleNerSummaryArea: function() {
            this.ner_summary_show = !this.ner_summary_show;
        },
        toggleNerFilterArea: function() {
            this.ner_filter_show = !this.ner_filter_show;
        },
        setAllNerFilter: function() {
            for(let tag of Object.keys(this.ner_filter)) {
                this.ner_filter[tag] = true;
            }
        },
        resetAllNerFilter: function() {
            for(let tag of Object.keys(this.ner_filter)) {
                this.ner_filter[tag] = false;
            }

        }
    },
    computed: {
        isInitKeywordCustomInputDisabled: function() {
            if(this.btnLock) {
                return true;
            } else {
                if (this.initKeyword == "custom") return false;
                else return true;
            }
        },
        nerTags: function() {
            return Object.keys(this.ner_filter).sort();
        },
        nerTagSummary: function() {
            let result = {};
            let total = 0;

            for(let tag of this.nerTags) {
                result[tag] = 0;
            }

            for(let word_tag of this.keywords.ner) {
                for(let tag_count of word_tag["tags"]) {
                    result[tag_count["tag"].toLowerCase()] += tag_count["count"];
                    total += tag_count["count"];
                }
            }

            //sort
            let result_array = [];
            for(let tag of Object.keys(result)) {
                let count = result[tag];

                if(count != 0) result_array.push({
                    tag: tag,
                    count: count
                });
            }
            result_array.sort((a, b) => (b["count"] - a["count"]));

            return {
                result: result_array,
                total: total
            };
        }
    },
    watch: {
        initKeyword: function(newVal) {
            if (newVal != "custom") {
                this.initKeywordCustomInput = "";
            }
        },
        book: {
            deep: true,
            handler() {
                this.resetKeywords();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#keyword-component.hidden {
    display: none;
}

#option-area {
    .area-title {
        cursor: pointer;
    }

    .area-content {
        &.hidden {
            display: none;
        }

        .option-item {
            margin: {
                bottom: 1em;
            }

            &:last-child {
                margin: {
                    bottom: 0;
                }
            }

            .option-item-title {
                margin: {
                    bottom: 0.5em;
                }
            }
        }
    }
}

#keyword-num-option-item {
    .input-group {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;

        .keyword-num-btn {
            width: 1em;
            padding: 0.5em;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #ddd;
            cursor: pointer;

            &.decrease-btn {
                border-top-left-radius: 0.5em;
                border-bottom-left-radius: 0.5em;
            }

            &.increase-btn {
                border-top-right-radius: 0.5em;
                border-bottom-right-radius: 0.5em;
            }
        }

        .keyword-num-input {
            margin: {
                left: -1px;
                right: -1px;
            }

            border-radius: 0;
        }
    }
}

#init-keyword-option-item {
    .option-item-content {
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 1em;
        align-items: center;
    }
}

.submit-btn-area {
    display: flex;
    justify-content: flex-end;
}

#result-area {
    &.hidden {
        display: none;
    }

    > .area-content {
        &.success {
            border-color: #28a745;

            > div {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                column-gap: 1em;

                .area {
                    .area-title {
                        font-size: 1em;
                    }

                    &.tfidf,
                    &.together {
                        .area-content {
                            p {
                                margin: {
                                    bottom: 0.5em;
                                }

                                padding: {
                                    top: 0.5em;
                                    bottom: 0.5em;
                                    left: 0.5em;
                                    right: 0.5em;
                                }
                                border-radius: 0.5em;
                                border: 1px solid #ddd;
                                background-color: #EFEFEF4D;

                                &:last-child {
                                    margin: {
                                        bottom: 0;
                                    }
                                }
                            }
                        }
                    }

                    &.ner {
                        .area-title {
                            .icon {
                                margin: {
                                    left: 0.5em;
                                }
                                cursor: pointer;

                                &.deactivated {
                                    opacity: 0.3;
                                }

                                &:hover {
                                    opacity: 1;
                                }
                            }
                        }

                        .area-content {
                            .ner-summary {
                                margin: {
                                    bottom: 1em;
                                }

                                &.hidden {
                                    display: none;
                                }

                                ul {
                                    list-style-position: inside;
                                    line-height: 1.5;
                                }
                            }

                            .ner-filter {
                                display: grid;
                                grid-template-rows: auto 1fr;
                                row-gap : 0.5em;
                                margin: {
                                    bottom: 1em;
                                }
                                
                                &.hidden {
                                    display: none;
                                }

                                .ner-filter-ctrl-btns {
                                    display: grid;
                                    grid-template-columns: 1fr 1fr;
                                    column-gap: 1em;
                                    justify-items: center;
                                }

                                .ner-filter-checkboxs {
                                    line-height: 1.5;

                                    .ner-filter-checkbox-item {
                                        display: inline-block;
                                        margin: {
                                            right: 0.5em;
                                        }
                                    }
                                }
                            }

                            .word-tags {
                                line-height: 1.5;

                                .word-tag {
                                    display: inline-block;
                                    padding: {
                                        top: 0.2em;
                                        bottom: 0.2em;
                                        left: 0.4em;
                                        right: 0.4em;
                                    }
                                    margin: {
                                        top: 0.2em;
                                        bottom: 0.2em;
                                        left: 0.5em;
                                        right: 0.5em;
                                    }
                                    word-break: keep-all;
                                    white-space: nowrap;
                                    border-radius: 0.5em;
                                    vertical-align: bottom;

                                    &.hidden {
                                        display: none;
                                    }

                                    &.dominant-tag-tm {
                                        background-color: gainsboro;
                                    }

                                    &.dominant-tag-lc {
                                        background-color: yellow;
                                    }

                                    &.dominant-tag-cv {
                                        background-color: orange;
                                    }

                                    &.dominant-tag-cv_pos {
                                        background-color: thistle;
                                    }

                                    &.dominant-tag-am {
                                        background-color: burlywood;
                                    }

                                    &.dominant-tag-am_body {
                                        background-color: darkgrey;
                                    }

                                    &.dominant-tag-og {
                                        background-color: lightcyan;
                                    }

                                    &.dominant-tag-ev {
                                        background-color: lightgreen;
                                    }

                                    &.dominant-tag-dt {
                                        background-color: lightpink;
                                    }

                                    &.dominant-tag-qt {
                                        background-color: lightgoldenrodyellow;
                                    }

                                    &.dominant-tag-ps {
                                        background-color: lightskyblue;
                                    }

                                    &.dominant-tag-ti {
                                        background-color: linen;
                                    }

                                    &.dominant-tag-af {
                                        background-color: palevioletred;
                                    }

                                    &.dominant-tag-fd {
                                        background-color: lightsalmon;
                                    }

                                    &.dominant-tag-mt {
                                        background-color: lightsteelblue;
                                    }

                                    &.dominant-tag-pt {
                                        background-color: lightslategray;
                                    }

                                    &.dominant-tag-tr {
                                        background-color: lightcoral;
                                    }

                                    span {
                                        color: #555;
                                        font-size: 0.8em;
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
        
        &.fail {
            border-color: #dc3545;
        }
    }
}
</style>
