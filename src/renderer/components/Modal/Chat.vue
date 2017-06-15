<template>
  <div class="f-modal" transition="v-slide-y-reverse-transition">
    <v-btn @click.native="closeModal" icon="icon" class="white--text f-btn-close pink accent-3" >
      <v-icon>close</v-icon>
    </v-btn>

    <div class="profile cf">
      <img class="block left avatar" :src="match.person.photos[0].processedFiles[3].url" :alt="match.person.name"> 
      <img class="block left super-like" v-if="match.super_liker" src="../../images/star2.png" alt="">
      <div class="name left">{{ match.person.name }}</div>
      <v-btn @click.native="showProfile" light flat class="light-blue accent-3 white--text btn-profile"></v-btn>
    </div>

    <div class="content">
      <div v-for="message in match.messages" :class="{ message: true, sent: message.from == userId, received: message.from != userId }">
        <div class="message-inner" v-if="message.message.indexOf('.giphy.com/media/') === -1">{{ message.message }}</div>
        <div class="message-inner gif" v-if="message.message.indexOf('.giphy.com/media/') > -1">
          <img :src="message.message">
        </div>
      </div>
    </div>

    <div class="message-box">
      <input type="text" placeholder="Type a message..." v-model="draft" @keyup.enter="send" id="text-box">
      <v-btn @click.native="send" class="btn-send" :disabled="!this.draft.length" light flat>Send</v-btn>
    </div>
  </div>
</template>

<script>
  // import Moment from 'moment'
  import Api from '../../services/Api'
  export default {
    props: ['matched', 'index'],
    data () {
      return {
        match: this.matched,
        draft: ''
      }
    },
    methods: {
      closeModal () {
        App.modalController.splice(this.index)
      },
      showProfile () {
        const modal = {
          userId: this.match.person._id,
          matchId: this.match._id
        }
        App.modalController.push(modal)
      },
      send () {
        var message = this.draft
        var id = this.match._id
        this.draft = ''

        Api.sendMessage(id, message, (error, response) => {
          if (error) { console.log(error) }
          this.match.messages.push(response)
          setTimeout(() => {
            this.scrollBottom()
          }, 200)
        })
      },
      onNewMessage (event) {
        if (event.detail && this.match._id === event.detail._id) {
          this.match = event.detail
          setTimeout(() => {
            this.scrollBottom()
          }, 200)
        }
      },
      scrollBottom () {
        var container = this.$el.querySelector('.content')
        container.scrollTop = container.scrollHeight
      }
    },
    computed: {
      userId () {
        return localStorage.userId
      }
    },
    mounted () {
      this.match = this.matched
      console.log(this.matched)
      this.scrollBottom()
      this.$el.querySelector('#text-box').focus()
      window.addEventListener('message', this.onNewMessage, false)
    },
    beforeDestroy () {
      window.removeEventListener('message', this.onNewMessage)
    },
    name: 'messages'
  }
</script>

<style scoped>
  .profile {
    background: #fff;
    position: fixed;
    padding: 17px 30px;
    top: 0;
    left: 0;
    right: 0;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    z-index: 1;
  }
  .profile .btn-profile {
    position: absolute;
    top: -6px;
    left: -6px;
    width: 70%;
    height: 100%;
    opacity: 0;
  }
  .avatar {
    vertical-align: middle;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .super-like{
    height: 20px;
    width: auto;
    margin-right: 7px;
    margin-top: 13px;
  }
  .name {
    margin-top: 10px;
  }
  .content {
    position: fixed;
    top: 80px;
    bottom: 41px;
    left: 0;
    right: 0;
    padding-top: 20px;
    padding-bottom: 30px;
    overflow: auto;
  }
  .message {
    font-size: 16px;
    font-weight: bolder;
    margin-bottom: 3px;
  }
  .message-inner {
    display: inline-block;
    padding: 8px 15px;
    border-radius: 4px;
    line-height: 1.2em;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .received {
    margin-right: 30%;
    margin-left: 20px;
  }
  .received .message-inner {
    background: #e5e5e5;
  }
  .sent {
    margin-left: 30%;
    margin-right: 20px;
    text-align: right;
    color: #fff;
  }
  .sent .message-inner {
    background: #2bb2c8;
    text-align: left;
  }
  .sent + .received, .received + .sent {
    margin-top: 10px;
  }
  .message-box {
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 41px;
    overflow: hidden;
    border-top: 1px solid #ccc;
  }
  .message-box input {
    position: relative;
    top: -4px;
    height: 40px;
    width: calc(100% - 110px);
    outline: 0;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 15px;
    font-weight: bolder;
  }
  .btn-send {
    position: relative;
    top: -4px;
    color: #2bb2c8;
  }
  .gif {
    padding: 0;
  }
  .gif img {
    display: block;
    border-radius: 4px;
    width: 100%;
  }
</style>
