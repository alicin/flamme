<template>
  <img :src="uri">
</template>

<script>
  export default {
    name: 'icon',
    props: ['name'],
    computed: {
      uri: function () {
        return require('../icons/' + this.name + '.svg')
      }
    }
  }
</script>

<style scoped>
  img {
    background: #333;
  }
</style>
