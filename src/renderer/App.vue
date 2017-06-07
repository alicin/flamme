<template>
  <v-app id="example-1">
    <v-toolbar fixed class="pink accent-2 elevation-0">
      <v-icon class="white--text">whatshot</v-icon> 
      <v-toolbar-title class="white--text">Flamme</v-toolbar-title>
      <v-toolbar-item class="toolbar-item" v-if="rate_limited_until">
        <v-icon class="icon">favorite</v-icon> 
        <countdown :date="rate_limited_until"></countdown>
      </v-toolbar-item>
      <v-toolbar-item class="toolbar-item" v-if="super_likes_remaining > -1">
        <v-icon class="icon white--text">star</v-icon> 
        <span v-if="super_likes_remaining" class="white--text">{{ super_likes_remaining }}</span>
        <countdown class="white--text" v-if="!super_likes_remaining" :date="super_likes_resets_at"></countdown>
      </v-toolbar-item>
    </v-toolbar>
    <main>
      <router-view></router-view>
    </main>
    <v-bottom-nav absolute value="true" class="white">
      <v-btn router href="/" flat class="pink--text accent-3" @click.native="e1 = 1" :value="e1 === 1">
        <span>Profile</span>
        <v-icon>face</v-icon>
      </v-btn>
      <v-btn router href="/landing" flat class="pink--text accent-3" @click.native="e1 = 2" :value="e1 === 2">
        <span>Matches</span>
        <v-icon>favorite</v-icon>
      </v-btn>
      <v-btn router href="/swipe" flat class="pink--text accent-3" @click.native="e1 = 3" :value="e1 === 3">
        <span>Swipe</span>
        <v-icon>account_box</v-icon>
      </v-btn>
      <v-btn router href="/analyze" flat class="pink--text accent-3" @click.native="e1 = 4" :value="e1 === 4">
        <span>Analyze</span>
        <v-icon>show_chart</v-icon> 
      </v-btn>
    </v-bottom-nav>
    <modals></modals>
  </v-app>
</template>

<script>
  import Sync from './services/Sync'
  import Api from './services/Api'
  import Modals from './components/Modal/Modals'
  import Countdown from './components/Helpers/Countdown'
  export default {
    components: {
      Modals,
      Countdown
    },
    data () {
      return {
        profile: false,
        historyInterval: false,
        notification: false,
        e1: 1,
        super_likes_remaining: -1,
        rate_limited_until: false,
        super_likes_resets_at: false
      }
    },
    methods: {
      historyCheck () {
        Api.history((error, history) => {
          if (error) {
            clearInterval(this.historyInterval)
            this.$router.push('/')
            this.e1 = 1
            return
          }
          console.log('got history.')
          this.notification = Sync.checkMatches(history)
          if (this.notification) {
            var event = new Event('update')
            window.dispatchEvent(event)
          }
        })
      }
    },
    created () {
      window.App = this
    },
    mounted () {
      this.historyCheck()
      this.historyInterval = setInterval(this.historyCheck, 10000)
    }
  }
</script>

<style src="./css/vuetify.min.css"></style>
<style src="./css/fonts.css"></style>

<style>
  
  * {
    margin: 0;
    padding: 0;
  }
  
  html {
    overflow: hidden;
  }

  html,
  body { height: 100%; color: #555;}

  main {
    position: fixed;
    top: 56px;
    bottom: 56px;
    left: 0;
    right: 0;
    padding-top: 0 !important;
    overflow: auto;
  }
  ul, nav {
    padding-left: 0;
    list-style-type: none;
  }

  h6 {
    font-size: 18px;
  }
  
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .cf:before,
  .cf:after {
      content: " ";
      display: table;
  }

  .cf:after {
      clear: both;
  }

  .no-drag img {
    user-drag: none; 
    user-select: none;
  }

  .clickable {
    cursor: pointer;
  }
  
  .f-modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 9999;
    overflow: auto;
    box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.41);
  }
  .f-btn-close {
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 2;
  }
  .toolbar-item {
    font-weight: bolder;
    font-size: 16px;
  }
  .toolbar-item .icon {
    margin-right: 5px;
  }
</style>
