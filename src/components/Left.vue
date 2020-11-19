<template>
<div id="left" class="panel" :class="{collapse: leftPanelCollapse}">
    <div class="area" id="book-info-area">
        <p class="area-title" @click="toggleBookInfo">도서 정보</p>
        <div class="area-content" :class="{hidden: (!showBookInfo || book.is_user_input), 'no-image': !book.cover}">
            <table>
                <tr>
                    <td class="col-1">제목</td>
                    <td class="col-2">{{ book.title }}</td>
                </tr>
                <tr>
                    <td class="col-1">저자</td>
                    <td class="col-2">{{ book.author }}</td>
                </tr>
                <tr>
                    <td class="col-1">출판사</td>
                    <td class="col-2">{{ book.publisher }}</td>
                </tr>
            </table>
            
            <img :src="getCoverImage" :class="{'hidden': !book.cover}">
        </div>

        
    </div>
    <div class="area" id="book-content-area">
        <p class="area-title">도서 내용</p>
        <textarea class="area-content" v-model="book.content" @input="onTextareaChange" spellcheck="false" :disabled="btnLock"></textarea>
    </div>
</div>
</template>

<script>
export default {
    name: 'Left',
    props: {
        bookFromParent: Object,
        leftPanelCollapse: Boolean,
        btnLock: Boolean
    },
    data: function() {
        return {
            book: this.bookFromParent,
            showBookInfo: true,
        }
    },
    methods: {
        toggleBookInfo: function() {
            this.showBookInfo = !this.showBookInfo;
        },
        onTextareaChange: function() {
            this.$emit("book-content-changed", this.book.content);
        },
        onLoadBook: function() {
            this.showBookInfo = true;
        }
    },
    watch: {
        bookFromParent: function(newVal) {
            this.book = newVal;
        }
    },
    computed: {
        getCoverImage: function() {
            if(this.book.cover) {
                return 'data:image/png;base64,' + this.book.cover;
            } else {
                return undefined;
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#left {
    display: grid;
    grid-template-rows: auto 1fr;
    overflow-y: hidden;

    &.collapse {
        display: none;
    }
}

#book-info-area {
    .area-title {
        cursor: pointer;
    }

    .area-content {
        display: grid;
        grid-template-columns: 1fr 80px;
        column-gap: 1em;
        align-items: center;
        background-color: #EFEFEF4D;
        box-sizing: border-box;

        &.hidden {
            display: none;
        }

        &.no-image {
            grid-template-columns: 1fr;

            .image-wrapper {
                display: none;
            }
        }

        table {
            width: 100%;
            border-collapse: separate;
            box-sizing: border-box;

            td {
                vertical-align: top;
                padding: {
                    bottom: 0.75em;
                }
            }

            tr:last-child td {
                padding: 0;
            }

            .col-1 {
                width: 4em;
            }
        }

        img {
            height: auto;
            width: 100%;
            box-sizing: border-box;

            &.hidden {
                display: none;
            }
        }
    }

    
}

#book-content-area {
    display: grid;
    grid-template-rows: auto 1fr;
}
</style>

