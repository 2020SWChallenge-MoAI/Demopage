<template>
    <header>
        <p class="title">TTOKDOK DEMO PAGE</p>
    </header>
</template>

<script>
export default {
    name: 'Header',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
header {
    padding: 1em;
    background-color: #343a40;
    color: #fff;
    display: grid;
    grid-template-columns: 1fr;

    .title {
        font-size: 1em;
        display: inline-block;
    }
}
</style>
