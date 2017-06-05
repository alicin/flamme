<template>
  <div class="messages-modal" transition="v-slide-y-reverse-transition">
    <v-btn @click.native="closeModal" icon="icon" class="white--text btn-close pink accent-3" >
      <v-icon>close</v-icon>
    </v-btn>

    <div class="profile">
      <img :src="match.person.photos[0].processedFiles[3].url" :alt="match.person.name"> {{ match.person.name }}
      <v-btn @click.native="profile = true" light flat class="light-blue accent-3 white--text"></v-btn>
    </div>
    <profile-detail v-if="profile" :id="match.person._id" :index="index"></profile-detail>

    <div class="content">
      <div v-for="message in match.messages" :class="{ message: true, sent: message.from == userId, received: message.from != userId }">
        <div class="message-inner">
          {{ message.message }}
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
  import ProfileDetail from '../Profile/ProfileDetail'
  export default {
    props: ['match', 'index'],
    data () {
      return {
        draft: '',
        profile: false,
        loaded: false
      }
    },
    components: {
      ProfileDetail
    },
    methods: {
      closeModal () {
        this.$parent.$parent.messages = false
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
      this.scrollBottom()
      this.$el.querySelector('#text-box').focus()
    },
    name: 'messages'
  }
</script>

<style scoped>
  .progress {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -35px;
    margin-left: -35px;
  }
  .messages-modal {
    text-align: left;
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 9999;
    overflow: auto;
  }
  .btn-close {
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 2;
  }

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
  .profile img {
    vertical-align: middle;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 20px;
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
</style>
