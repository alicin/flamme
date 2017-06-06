<template>
  <li class="clickable" @click="showMessages">
    <img :src="out.match.person.photos[0] ? out.match.person.photos[0].processedFiles[2].url : ''" alt="">
    <p class="name">{{ out.match.person.name }}</p>
    <p class="act"><span>{{ out.status.emoji }}</span> {{ out.status.tag }}</p>
  </li>
</template>

<script>
  import Messages from '../Profile/Messages'
  export default {
    name: 'going-out',
    props: ['out'],
    components: {
      Messages
    },
    data () {
      return {
        messages: false
      }
    },
    methods: {
      showMessages () {
        const modal = {
          match: this.out.match
        }
        App.modalController.push(modal)
      },
      unmatch () {
        this.$parent.unmatch(this.index)
      }
    }
  }
</script>

<style scoped>
  li {
    position: relative;
    float: left;
    width: 120px;
    height: 185px;
    overflow: hidden;
    margin-left: 5px;
  }
  li:after {
    content: "";
    text-align: right;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, .2) 50%);
    z-index: 1;
  }
  li img {
    width: 150px;
    position: relative;
    left: -15px;
  }
  li .name {
    position: absolute;
    color: #fff;
    top: 0px;
    left: 3px;
    font-weight: bold;
    z-index: 2;
  }
  li .act {
    text-align: center;
    font-size: 14px;
    font-weight: bolder;
    
  }
  li .act span {
    font-size: 20px;
  }
  .chat-button {
    position: absolute;
    top: 0;
    left: 0;
    height: 150px;
    width: 100%;
    display: block;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: 3;
  }
</style>
