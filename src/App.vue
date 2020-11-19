<template>
<div class="app-wrapper">
    <Header />
    <div class="left-right-container" :class="{'no-left-panel': leftPanelCollapse}">
        <Left ref="left" :btn-lock="btnLock" :book-from-parent="book" :left-panel-collapse="leftPanelCollapse" @book-content-changed="bookContentChanged" />
        <Right :btn-lock="btnLock" :book="book" :left-panel-collapse="leftPanelCollapse" @toggle-left-panel="toggleLeftPanel" @load-book="loadBook" @lock-btns="lockBtns" @unlock-btns="unlockBtns"/>
    </div>
</div>
</template>

<script>
import Header from './components/Header.vue'
import Left from './components/Left.vue'
import Right from './components/Right.vue'

export default {
    name: 'App',
    components: {
        Header,
        Left,
        Right
    },
    data: function() {
        return {
            book: {
                bid: -1,
                title: "",
                author: "",
                publisher: "",
                content: "",
                cover: undefined,
                is_user_input: false
            },
            leftPanelCollapse: false,
            btnLock: false
        }
    },
    methods: {
        toggleLeftPanel: function() {
            this.leftPanelCollapse = !this.leftPanelCollapse;
        },
        lockBtns: function() {
            this.btnLock = true;
        },
        unlockBtns: function() {
            this.btnLock = false;
        },
        loadBook: async function(bid) {
            this.lockBtns();

            try {
                var response = await fetch(`/apiserver/load-text?bid=${bid}`, {
                    method: "GET"
                });

                if (response.ok) {
                    var json = await response.json();
                    this.book.bid = json["bid"];
                    this.book.title = json["title"];
                    this.book.author = json["author"];
                    this.book.publisher = json["publisher"];
                    this.book.content = json["content"];
                    this.book.cover = json["cover"];
                    this.book.is_user_input = false;
                } else {
                    console.log("ERROR");
                }
            } catch(error) {
                console.log(error);
            }
            
            this.$refs.left.onLoadBook();
            this.unlockBtns();
        },
        bookContentChanged: function(content) {
            this.book.bid = -1;
            this.book.title = "";
            this.book.author = "";
            this.book.publisher = "";
            this.book.cover = undefined;
            this.book.is_user_input = true;
            this.book.content = content;
        }
    }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

html, body, div, span, p, nav,
h1, h2, h3, h4, h5, h6, strong, small, b, u, i,
ul, ol, li, a, img, figure,
table, thead, tbody, tfoot, th, tr, td,
pre, blockquote {
	margin: 0;
	padding: 0;
	border: 0;
}

html {
    font-family: "Nanum Gothic", sans-serif;
	word-break: break-all;
    font-size: 1.2em;
}

pre, code {
    font-family: "Ubuntu Mono", "Nanum Gothic Coding", monospace;
}

button {
    font-size: inherit;
    font-family: inherit;
    background-color: #FFFFFF;
    
    &:focus {
        outline: none !important;
        border: 1px solid #ddd;
    }
}

select,
input {
    border: 1px solid #ddd;
    font-size: inherit;
    font-family: inherit;
    padding: {
        top: 0.5em;
        bottom: 0.5em;
        left: 0.5em;
        right: 0.5em;
    }
    border-radius: 0.5em;

    &:focus {
        outline: none !important;
        border: 1px solid #ddd;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    & {
        -moz-appearance: textfield;
    }
}

textarea {
    resize: none;
    line-height: 1.5;
    font-size: inherit;
    overflow: auto;
    font-family: inherit;

    &:focus {
        outline: none !important;
        border: 1px solid #ddd;
    }
}

html, body {
    height: 100%;
    max-height: 100%;
    min-height: 100%;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    overflow-y: hidden;
}

#app {
    height: 100%;
    max-height: 100%;
    min-height: 100%;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
}

.panel {
    padding: 1em;

    .area {        
        margin: {
            bottom: 1em;
        }

        &:last-child {
            margin: {
                bottom: 0;
            }
        }

        .area-title {
            font-size: 1.1em;
            margin: {
                bottom: 0.5em;
            }
        }

        .area-content {
            padding: 0.75em;
            border: 1px solid #ddd;
            border-radius: 0.5em;
        }
    }
}

.btn {
    cursor: pointer;

    &.deactivated {
        cursor: default !important;
        background-color: #EFEFEF4D !important;
        border-color: #ddd !important;
        color: #ddd !important;
    }

    &.round-btn {
        padding: 0.5em;
        border: 1px solid #ddd;
        border-radius: 0.5em;
        text-align: center;
        vertical-align: middle;

        &.blue-btn {
            background-color: #3884FF;
            border-color: #3884FF;
            color: #FFF;
        }

        &.black-btn {
            background-color: #343a40;
            border-color: #343a40;
            color: #FFF;
        }
    }
}
</style>

<style lang="scss" scoped>
.app-wrapper {
    display: grid;
    grid-template-rows: auto 1fr;
    overflow-y: hidden;
    height: 100%;
    max-height: 100%;
    min-height: 100%;
    width: 100%;
    max-width: 100%;
    min-width: 100%;

    .left-right-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow-y: hidden;

        &.no-left-panel {
            grid-template-columns: 1fr;
        }
    }
}
</style>