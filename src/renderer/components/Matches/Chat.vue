<template>
  <li class="clickable cf" @click="showMessages">
    <div class="img-wrapper">
      <img :src="match.person.photos[0] ? match.person.photos[0].processedFiles[2].url : ''" :alt="match.person.name" class="avatar">
      <span class="update pink accent-2" v-if="match.newMessage && !isReply(match.messages[match.messages.length - 1])"></span>
    </div>
    <div class="details">
      <p class="name">
        <img v-if="match.super_liker" class="super-like" src="../../images/star2.png" alt="">
        {{ match.person.name }} 
        <span class="last_seen">- {{ last_seen() }}</span> 
        <div v-if="$parent.unmatchMode" @click.stop="unmatch()" light flat class=" lighten-1 red--text">Unmatch</div>
      </p>
      <p class="message"><v-icon v-if="isReply(match.messages[match.messages.length - 1])" class="grey--text lighten-1 icon-reply"></v-icon>{{ match.messages[match.messages.length - 1].message }}</p>
    </div>
    <div class="seperator"></div>
  </li>
</template>

<script>
  import Moment from 'moment'
  import Messages from '../Profile/Messages'
  import Sync from '../../services/Sync'
  export default {
    name: 'chat',
    props: ['matched', 'index'],
    components: {
      Messages
    },
    data () {
      return {
        match: this.matched,
        messages: false,
        id: localStorage.userId
      }
    },
    methods: {
      showMessages () {
        const modal = {
          match: this.match
        }
        this.match.new = false
        this.match.newMessage = false
        Sync.unsetNew(this.match._id)
        this.$root.modalController.push(modal)
      },
      unmatch () {
        this.$parent.unmatch(this.index, this.match._id, 'chat')
      },
      isReply (message) {
        return message.from === localStorage.userId
      },
      onNewMessage (event) {
        if (event.detail && this.match._id === event.detail._id) {
          this.match = event.detail
        }
      },
      last_seen: function () {
        return Moment(this.match.messages[this.match.messages.length - 1].sent_date).fromNow()
      }
    },
    mounted () {
      window.addEventListener('message', this.onNewMessage, false)
    },
    beforeDestroy () {
      window.removeEventListener('message', this.onNewMessage)
    }
  }
</script>

<style scoped>
  li {
    padding: 10px 30px;
    position: relative;
  }
  .img-wrapper {
    width: 115px;
    margin-right: 30px;
    height: 115px;
    float: left;
    position: relative;
  }
  .avatar {
    width: 115px;
    height: auto;
    border-radius: 50%;
    display: block;
  }
  .details {
    width: calc(100% - 160px);
    display: block;
    float: left;
  }
  .message {
    font-size: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; 
    overflow: hidden; 
  }
  .name {
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px !important;
  }
  .seperator {
    position: absolute;
    left: 175px;
    right: 0;
    bottom: 0px;
    border-bottom: 1px solid #ccc;
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
  .icon-reply {
    position: relative;
    top: 5px;
    margin-right: 5px;
  }
  .last_seen {
    font-size: 14px;
    font-weight: normal;
    color: #999;
  }
  .update {
    display: block;
    position: absolute;
    top: 50%;
    right: -17px;
    margin-top: -17px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 4px solid #fff !important;
  }
  .super-like {
    display: inline-block;
    position: relative;
    top: 3px;
    height: 20px;
    width: auto;
    margin-right: 5px;
  }
</style>
