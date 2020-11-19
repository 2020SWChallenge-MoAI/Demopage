<template>
<div id="right" class="panel">
    <div class="ctrl-btns">
        <div class="left-panel-menu">
            <p id="toggle-left-panel-btn" class="fas round-btn btn" :class="{'fa-chevron-right': leftPanelCollapse, 'fa-chevron-left': !leftPanelCollapse}" @click="toggleLeftPanel"></p>
            <div class="book-loader">
                <input type="number" v-model="bid" class="input" :disabled="btnLock" placeholder="랜덤" @keyup.enter="loadBook">
                <p class="round-btn btn blue-btn" :class="{deactivated: btnLock}" @click="loadBook">도서 불러오기</p>
            </div>
        </div>

        <div class="tab-menu">
            <p class="tab-item round-btn btn" :class="{'black-btn': (currentTabItem == 0), deactivated: btnLock}" id="tab-item-keyword" @click="setCurrentTabItem(0)">키워드 추출</p>
            <p class="tab-item round-btn btn" :class="{'black-btn': (currentTabItem == 1), deactivated: btnLock}" id="tab-item-main-sentence" @click="setCurrentTabItem(1)">핵심 문장 추출</p>
            <p class="tab-item round-btn btn" :class="{'black-btn': (currentTabItem == 2), deactivated: btnLock}" id="tab-item-qna" @click="setCurrentTabItem(2)">문제 적합도 평가</p>
        </div>
    </div>
    
    <KeywordComponent :btnLock="btnLock" :currentTabItem="currentTabItem" :book="book" @lock-btns="lockBtns" @unlock-btns="unlockBtns"></KeywordComponent>
    <MainSentenceComponent :btnLock="btnLock" :currentTabItem="currentTabItem" :book="book" @lock-btns="lockBtns" @unlock-btns="unlockBtns"></MainSentenceComponent>
    <QnAComponent :btnLock="btnLock" :currentTabItem="currentTabItem" :book="book" @lock-btns="lockBtns" @unlock-btns="unlockBtns"></QnAComponent>
</div>
</template>

<script>
import KeywordComponent from './Keyword.vue'
import MainSentenceComponent from './MainSentence.vue'
import QnAComponent from './QnA.vue'

export default {
    name: 'Right',
    components: {
        KeywordComponent,
        MainSentenceComponent,
        QnAComponent
    },
    props: {
        leftPanelCollapse: Boolean,
        book: Object,
        btnLock: Boolean
    },
    data: function() {
        return {
            currentTabItem: 0,
            bid: ""
        }
    },
    methods: {
        lockBtns: function() {
            this.$emit("lock-btns");
        },
        unlockBtns: function() {
            this.$emit("unlock-btns");
        },
        toggleLeftPanel: function() {
            this.$emit("toggle-left-panel");
        },
        setCurrentTabItem: function(index) {
            if(!this.btnLock) {
                this.currentTabItem = index;
            }
        },
        loadBook: function() {
            if(!this.btnLock) {
                var bid = this.bid;
                if(bid == "") {
                    bid = -1;
                }

                this.$emit("load-book", bid);
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#right {
    grid-template-rows: auto 1fr;
    overflow-y: scroll;
}

.ctrl-btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: {
        bottom: 1em;
    }

    .left-panel-menu {
        display: grid;
        grid-template-columns: auto auto;
        align-items: center;
        column-gap: 0.5em;

        .book-loader {
            display: grid;
            grid-template-columns: 3em auto;
            align-items: 0.5em;

            input {
                border-top-right-radius: 0 !important;
                border-bottom-right-radius: 0 !important;
            }

            .btn {
                border-top-left-radius: 0 !important;
                border-bottom-left-radius: 0 !important;
                margin: {
                    left: -1px;
                }
            }
        }
    }

    .tab-menu {
        display: grid;
        grid-template-columns: auto auto auto;
        align-items: center;
        column-gap: 0.5em;
    }
}

#toggle-left-panel-btn {
    width: 1em;
    height: 1em;
    text-align: center;
}
</style>
