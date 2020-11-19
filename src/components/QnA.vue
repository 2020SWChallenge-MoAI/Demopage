<template>
<div id="qna-component" :class="{hidden: (currentTabItem != 2)}">
    <div class="question-area area">
        <p class="area-title">문제</p>
        <div class="area-content">
            <div class="question">
                <input type="text" v-model="question" @input="onQuestionChanged" @keyup.enter="questionSubmit" :disabled="btnLock">
                <p class="btn round-btn blue-btn" :class="{deactivated: btnLock}" @click="questionSubmit">검사하기</p>
            </div>
            <div class="result" v-if="(questionResult.status != 0)">
                <div v-if="(questionResult.status == 1)" class="result-item success">
                    <p>적합한 문제</p>
                    <p>score : {{ Number(questionResult.score).toFixed(3) }}</p>
                </div>
                <div v-if="(questionResult.status == -1)" class="result-item fail">
                    <p>부적합한 문제</p>
                    <p>score : {{ Number(questionResult.score).toFixed(3) }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="answer-area area">
        <p class="area-title">답</p>
        <div class="area-content">
            <div class="type area">
                <p class="area-title">유형</p>
                <div class="area-content">
                    <p class="btn round-btn" :class="{'black-btn': (type == 0), deactivated: btnLock}" @click="changeType(0)">객관식</p>
                    <p class="btn round-btn" :class="{'black-btn': (type == 1), deactivated: btnLock}" @click="changeType(1)">주관식</p>
                </div>
            </div>

            <div class="multiple-choice-answer area" v-if="(type == 0)">
                <p class="area-title">보기<i class="fas fa-plus-square icon" title="보기 추가하기" @click="increaseMultipleChoiceOptionNum"></i><i class="fas fa-minus-square icon" title="보기 제거하기" @click="decreaseMultipleChoiceOptionNum"></i></p>
                <div class="area-content">
                    <div class="option-item" v-for="i in multipleChoiceOptionNum" :key="i">
                        <input type="radio" v-model="multipleChoiceAnswer" :value="i" @input="onAnswerChanged" :disabled="btnLock">
                        <input type="text" v-model="multipleChoiceOptions[i]" @input="onAnswerChanged" @keyup.enter="answerSubmit" :disabled="btnLock">
                    </div>
                </div>
            </div>

            <div class="short-answer area" v-if="(type == 1)">
                <p class="area-title">정답</p>
                <div class="area-content">
                    <input type="text" v-model="shortAnswer" @input="onAnswerChanged" @keyup.enter="answerSubmit" :disabled="btnLock">
                </div>
            </div>

            <div class="answer-submit-btn-area">
                <p class="btn round-btn blue-btn answer-submit" :class="{deactivated: btnLock}" @click="answerSubmit">검사하기</p>
            </div>

            <div class="result" v-if="(answerResult.status != 0)">
                <div v-if="(answerResult.status == 1)" class="result-item success">
                    <p>적합한 답</p>
                    <p>score : {{ answerResult.score }}</p>
                    <p>AI가 추론한 답 : {{ answerResult.electra_answer }}</p>
                </div>
                <div v-if="(answerResult.status == -1)" class="result-item fail">
                    <p>부적합한 답</p>
                    <p>score : {{ answerResult.score }}</p>
                    <p>AI가 추론한 답 : {{ answerResult.electra_answer }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'QnAComponent',
    props: {
        currentTabItem: Number,
        book: Object,
        btnLock: Boolean
    },
    data: function() {
        return {
            question: "",
            questionResult: {
                status: 0,  //0 : not analyzed, 1 : success, -1 : fail
                score: 0
            },
            type: 1, //0 : 객관식, 1 : 주관식,
            multipleChoiceOptionNum: 2,
            multipleChoiceOptions: {},
            multipleChoiceAnswer: 1,
            shortAnswer: "",
            answerResult: {
                status: 0,
                score: 0,
                electra_answer: ""
            }
        }
    },
    methods: {
        resetQuestion: function() {
            this.questionResult = {
                status: 0,
                score: 0
            }
        },
        resetAnswer: function() {
            this.answerResult = {
                status: 0,
                score: 0
            }
        },
        questionSubmit: async function() {
            if(!this.btnLock) {
                this.$emit("lock-btns");
                this.resetQuestion();

                let bid = this.book.bid;
                let content = this.book.content;
                let question = this.question;

                if (content.length == 0) {
                    alert("도서 내용이 비어 있습니다.");
                    this.$emit("unlock-btns");
                    return;
                }

                if (question.length == 0) {
                    alert("문제를 입력해 주세요.");
                    this.$emit("unlock-btns");
                    return;
                }

                try {
                    let response = await fetch(`/apiserver/verify-question`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            bid: bid,
                            content: content,
                            question: question
                        })
                    });

                    if (response.ok) {
                        this.questionResult.score = (await response.json())["score"];
                        this.questionResult.status = 1;
                    } else {
                        this.questionResult.score = (await response.json())["score"];
                        this.questionResult.status = -1;
                    }
                } catch(error) {
                    console.log(error);
                    this.questionResult.status = -1;
                }

                this.$emit("unlock-btns");
            }
        },
        changeType: function(type) {
            if(!this.btnLock) {
                this.type = type;
                this.resetAnswer();
            }
        },
        increaseMultipleChoiceOptionNum: function() {
            if(!this.btnLock) {
                if (this.multipleChoiceOptionNum < 4) {
                    this.multipleChoiceOptionNum++;
                    this.resetAnswer();
                }
            }
        },
        decreaseMultipleChoiceOptionNum: function() {
            if(!this.btnLock) {
                if (this.multipleChoiceOptionNum > 2) {
                    this.multipleChoiceOptionNum--;
                    this.resetAnswer();
                }
            }
        },
        answerSubmit: async function() {
            if(!this.btnLock) {
                this.$emit("lock-btns");
                this.resetAnswer();

                let content = this.book.content;
                let type = this.type;

                if (content.length == 0) {
                    alert("도서 내용이 비어 있습니다.");
                    this.$emit("unlock-btns");
                    return;
                }

                if (this.questionResult.status != 1) {
                    alert("적합한 문제를 입력해 주세요.");
                    this.$emit("unlock-btns");
                    return;
                }

                let question = this.question;

                let answer;
                if (type == 0) {
                    if (this.multipleChoiceAnswer > this.multipleChoiceOptionNum) {
                        alert("정답이 선택되지 않았습니다.");
                        this.$emit("unlock-btns");
                        return;
                    }

                    answer = `${this.multipleChoiceAnswer}`;
                    for(let i = 1; i <= this.multipleChoiceOptionNum; i++) {
                        if (!Object.keys(this.multipleChoiceOptions).includes(`${i}`) || this.multipleChoiceOptions[i].length == 0) {
                            alert("빈 보기가 있습니다.");
                            this.$emit("unlock-btns");
                            return;
                        }
                        answer += `#@@#${this.multipleChoiceOptions[i]}`
                    }
                } else {
                    if (this.shortAnswer.length == 0) {
                        alert("답이 입력되지 않았습니다.");
                        this.$emit("unlock-btns");
                        return;
                    }
                    answer = this.shortAnswer;
                }

                try {
                    let response = await fetch(`/apiserver/verify-answer`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            content: content,
                            question: question,
                            type: type,
                            answer: answer
                        })
                    });

                    if (response.ok) {
                        let json = await response.json();
                        this.answerResult.score = json["score"];
                        this.answerResult.electra_answer = json["electra_answer"];
                        this.answerResult.status = 1;
                    } else {
                        let json = await response.json();
                        this.answerResult.score = json["score"];
                        this.answerResult.electra_answer = json["electra_answer"];
                        this.answerResult.status = -1;
                    }
                } catch(error) {
                    console.log(error);
                    this.answerResult.status = -1;
                }

                this.$emit("unlock-btns");
            }
        },
        onQuestionChanged: function() {
            this.resetQuestion();
            this.resetAnswer();
        },
        onAnswerChanged: function() {
            this.resetAnswer();
        }
    },
    watch: {
        book: {
            deep: true,
            handler() {
                this.resetQuestion();
                this.resetAnswer();
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#qna-component {
    &.hidden {
        display: none;
    }
}

.question-area {
    .area-content {
        .question {
            display: grid;
            grid-template-columns: 1fr auto;
            column-gap: 1em;
            margin: {
                bottom: 1em;
            }

            &:last-child {
                margin: {
                    bottom: 0;
                }
            }
        }

        .result {
            .result-item {
                padding: 0.75em;
                border-radius: 0.5em;
                line-height: 1.5;
                
                &.success {
                    border: 1px solid #28a745;
                }

                &.fail {
                    border: 1px solid #dc3545;
                }
            }
        }
    }
}

.answer-area {
    .area-content {
        .area {
            .area-content {
                padding: 0;
                border: 0;
            }
        }

        .type {
            .area-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                column-gap: 1em;
            }
        }

        .multiple-choice-answer {
            .area-title {
                .icon {
                    margin: {
                        left: 0.5em;
                    }
                    opacity: 0.3;
                    cursor: pointer;

                    &:hover {
                        opacity: 1;
                    }
                }
            }

            .area-content {
                .option-item {
                    margin: {
                        bottom: 0.5em;
                    }
                    display: grid;
                    grid-template-columns: 1em 1fr;
                    column-gap: 1em;
                    align-items: center;
                    
                    &:last-child {
                        margin: {
                            bottom: 0;
                        }
                    }
                }
            }
        }

        .short-answer {
            input {
                width: 100%;
                box-sizing: border-box;
            }
        }

        .answer-submit-btn-area {
            display: flex;
            justify-content: flex-end;
            margin: {
                bottom: 1em;
            }

            &:last-child {
                margin: {
                    bottom: 0;
                }
            }
        }

        .result {
            .result-item {
                padding: 0.75em;
                border-radius: 0.5em;
                line-height: 1.5;
                
                &.success {
                    border: 1px solid #28a745;
                }

                &.fail {
                    border: 1px solid #dc3545;
                }
            }
        }
    }
}

</style>
