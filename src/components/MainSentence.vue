<template>
<div id="main-sentence-component" :class="{hidden: (currentTabItem != 1)}">
    <div class="area" id="option-area">
        <p class="area-title" @click="toggleOption">옵션</p>
        <div class="area-content" :class="{hidden: !showOption}">
            <div class="option-item" id="main-sentence-num-option-item">
                <p class="option-item-title">핵심 문장 개수</p>
                <div class="input-group option-item-content">
                    <p @click="decreaseMainSentenceNum" class="main-sentence-num-btn decrease-btn btn" :class="{deactivated: btnLock}"><i class="fas fa-chevron-down"></i></p>
                    <input type="number" v-model="mainSentenceNum" class="input main-sentence-num-input" :disabled="btnLock">
                    <p @click="increaseMainSentenceNum" class="main-sentence-num-btn increase-btn btn" :class="{deactivated: btnLock}"><i class="fas fa-chevron-up"></i></p>
                </div>
            </div>
        </div>
    </div>
    <div class="submit-btn-area">
        <p class="submit-btn round-btn btn blue-btn" @click="submit" :class="{deactivated: btnLock}">AI 분석</p>
    </div>
    <div class="area" id="result-area" :class="{hidden: (mainSentenceStatus == 0)}">
        <p class="area-title">분석 결과</p>
        <div class="area-content" :class="{success: (mainSentenceStatus == 1), fail: (mainSentenceStatus == -1)}">
            <div v-for="(mainSentence, index) in mainSentences" v-bind:key="index" class="main-sentence">
                <span class="prev-sent">{{ mainSentence["prev"] }}</span>
                <span class="cur-sent">{{ mainSentence["cur"] }}</span>
                <span class="next-sent">{{ mainSentence["next"] }}</span>
                <span class="rank">[{{ Number(mainSentence["rank"]).toFixed(3) }}]</span>
            </div>
            <p v-if="(mainSentenceStatus == -1)">분석 실패</p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'MainSentenceComponent',
    props: {
        currentTabItem: Number,
        book: Object,
        btnLock: Boolean
    },
    data: function() {
        return {
            showOption: true,
            mainSentenceNum: 10,
            mainSentences: [],
            mainSentenceStatus: 0  //0 : not analyzed, 1 : successfully analyzed, -1: fail to analyze
        }
    },
    methods: {
        resetMainSentences: function() {
            this.mainSentenceStatus = 0;
            this.mainSentences = [];
        },
        toggleOption: function() {
            this.showOption = !this.showOption;
        },
        decreaseMainSentenceNum: function() {
            if(!this.btnLock) {
                if (this.mainSentenceNum > 1) this.mainSentenceNum--;
            }
        },
        increaseMainSentenceNum: function() {
            if(!this.btnLock) {
                this.mainSentenceNum++;
            }
        },
        submit: async function() {
            if(!this.btnLock) {
                this.$emit("lock-btns");
                this.resetMainSentences();

                var content = this.book.content;
                var num = this.mainSentenceNum;
                var bid = this.book.bid;

                if (content.length == 0) {
                    alert("도서 내용이 비어 있습니다.");
                    this.$emit("unlock-btns");
                    return;
                }

                try {
                    var response = await fetch(`/apiserver/main-sentence`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            text: content,
                            main_sentence_num: num,
                            bid: bid
                        })
                    });

                    if (response.ok) {
                        this.mainSentences = (await response.json())["main-sentences"];
                        this.mainSentenceStatus = 1;
                    } else {
                        this.mainSentenceStatus = -1;
                    }
                } catch(error) {
                    console.log(error);
                    this.mainSentenceStatus = -1;
                }

                this.$emit("unlock-btns");
            }
        }
    },
    watch: {
        book: {
            deep: true,
            handler() {
                this.resetMainSentences();
            }
        }
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#main-sentence-component.hidden {
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

#main-sentence-num-option-item {
    .input-group {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;

        .main-sentence-num-btn {
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

        .main-sentence-num-input {
            margin: {
                left: -1px;
                right: -1px;
            }

            border-radius: 0;
        }
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

    .area-content {
        &.success {
            border-color: #28a745;

            .main-sentence {
                margin: {
                    bottom: 0.5em;
                }
                padding: {
                    top: 0.5em;
                    bottom: 0.5em;
                    left: 0.5em;
                    right: 0.5em;
                }
                line-height: 1.5;
                border-radius: 0.5em;
                border: 1px solid #ddd;
                background-color: #EFEFEF4D;

                &:last-child {
                    margin: {
                        bottom: 0;
                    }
                }

                .cur-sent {
                    font-weight: bold;
                }

                span {
                    &::after {
                        content: " ";
                    }

                    &:last-child::after {
                        content: "";
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
