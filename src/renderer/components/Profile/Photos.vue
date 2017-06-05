<template>
  <ul class="cf">
    <li @click="selectPhoto(photo.url)" v-for="photo in photos" :class="{single: single}">
      <img draggable="false" :src="photo.url" v-if="!small">
      <img draggable="false" :src="photo.processedFiles[3].url" v-if="small">
      <span v-if="photo.successRate">{{ parseInt(photo.successRate * 100) }}%</span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['photos', 'small', 'single'],
    methods: {
      selectPhoto (url) {
        this.$parent.setImage(url)
      }
    },
    computed: {
      successRate: function () {
        return parseInt(this.photo.successRate * 100)
      }
    },
    name: 'photos'
  }
</script>

<style scoped>
  span {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: #fff;
    font-size: 10px;
    font-weight: bolder;
    padding-left: 4px;
    padding-right: 4px;
    border-radius: 10px;
  }
  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 3px;
  }
  li {
    width: 33.333334%;
    height: auto;
    padding: 0 5px 5px 0;
    float: left;
    overflow: hidden;
    position: relative;
  }
  li.single {
    width: 16.6666666667%;
  }
  ul {
    list-style-type: none;
    margin-bottom: 15px;
  }
</style>
