<template>
  <li class="clickable" @click="showMessages">
    <img :src="match.person.photos[0] ? match.person.photos[0].processedFiles[2].url : ''" :alt="match.person.name" class="profile-pic">
    <span class="update pink accent-2" v-if="match.new"></span>
    <p>
      <img v-if="match.super_liker" src="../../images/star2.png" class="super-like" alt="">
      {{ match.person.name }}
    </p>
    <div v-if="$parent.unmatchMode" @click.stop="unmatch()" light flat class=" lighten-1 red--text">Unmatch</div>
  </li>
</template>

<script>
  import Messages from '../Profile/Messages'
  import Sync from '../../services/Sync'
  export default {
    name: 'match',
    props: ['match', 'index'],
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
          match: this.match
        }
        Sync.unsetNew(this.match._id)
        this.match.new = false
        this.$root.modalController.push(modal)
      },
      unmatch () {
        this.$parent.unmatch(this.index, this.match._id, 'match')
      }
    }
  }
</script>

<style scoped>
  li {
    width: 115px;
    margin-left: 30px;
    float: left;
    text-align: center;
    position: relative;
  }
  .profile-pic {
    width: 100%;
    height: auto;
    border-radius: 50%;
    margin-bottom: 2px;
  }
  p {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 0;
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
  }
  .update {
    display: block;
    position: absolute;
    top: 57px;
    right: -10px;
    margin-top: -10px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 4px solid #fff !important;
  }
  .super-like {
    height: 20px;
    width: auto;
    margin-right: 5px;
  }
</style>
