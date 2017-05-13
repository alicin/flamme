<template>
  <v-app id="example-1">
    <v-toolbar fixed class="pink accent-2 elevation-0">
      <v-icon class="white--text">show_chart</v-icon> 
      <v-toolbar-title>Flamme</v-toolbar-title>
      <v-toolbar-item class="toolbar-item" v-if="rate_limited_until">
        <v-icon class="icon">favorite</v-icon> 
        <countdown :date="rate_limited_until"></countdown>
      </v-toolbar-item>
      <v-toolbar-item class="toolbar-item" v-if="super_likes_remaining > -1">
        <v-icon class="icon">star</v-icon> 
        <span v-if="super_likes_remaining">{{ super_likes_remaining }}</span>
        <countdown v-if="!super_likes_remaining" :date="super_likes_resets_at"></countdown>
      </v-toolbar-item>
    </v-toolbar>
    <main>
      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>
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
    </v-bottom-nav>
    <modals></modals>
  </v-app>
</template>

<script>
  import store from 'renderer/vuex/store'
  import Sync from './services/Sync'
  import Api from './services/Api'
  import Modals from './components/Modal/Modals'
  import Countdown from './components/Helpers/Countdown'
  export default {
    store,
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
    mounted () {
      this.historyCheck()
      this.historyInterval = setInterval(this.historyCheck, 20000)
    }
  }
</script>

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
    margin-top: 64px;
    margin-bottom: 56px;
  }
  ul, nav {
    list-style-type: none;
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
  



  @font-face {
  font-family: 'icomoon';
  src:  url('./fonts/icomoon.eot?ocigeo');
  src:  url('./fonts/icomoon.eot?ocigeo#iefix') format('embedded-opentype'),
    url('./fonts/icomoon.ttf?ocigeo') format('truetype'),
    url('./fonts/icomoon.woff?ocigeo') format('woff'),
    url('./fonts/icomoon.svg?ocigeo#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
}

[class^="icon-"], [class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-eye:before {
  content: "\e000";
}
.icon-paper-clip:before {
  content: "\e001";
}
.icon-mail:before {
  content: "\e002";
}
.icon-toggle:before {
  content: "\e003";
}
.icon-layout:before {
  content: "\e004";
}
.icon-link:before {
  content: "\e005";
}
.icon-bell:before {
  content: "\e006";
}
.icon-lock:before {
  content: "\e007";
}
.icon-unlock:before {
  content: "\e008";
}
.icon-ribbon:before {
  content: "\e009";
}
.icon-image:before {
  content: "\e010";
}
.icon-signal:before {
  content: "\e011";
}
.icon-target:before {
  content: "\e012";
}
.icon-clipboard:before {
  content: "\e013";
}
.icon-clock:before {
  content: "\e014";
}
.icon-watch:before {
  content: "\e015";
}
.icon-air-play:before {
  content: "\e016";
}
.icon-camera:before {
  content: "\e017";
}
.icon-video:before {
  content: "\e018";
}
.icon-disc:before {
  content: "\e019";
}
.icon-printer:before {
  content: "\e020";
}
.icon-monitor:before {
  content: "\e021";
}
.icon-server:before {
  content: "\e022";
}
.icon-cog:before {
  content: "\e023";
}
.icon-heart:before {
  content: "\e024";
}
.icon-paragraph:before {
  content: "\e025";
}
.icon-align-justify:before {
  content: "\e026";
}
.icon-align-left:before {
  content: "\e027";
}
.icon-align-center:before {
  content: "\e028";
}
.icon-align-right:before {
  content: "\e029";
}
.icon-book:before {
  content: "\e030";
}
.icon-layers:before {
  content: "\e031";
}
.icon-stack:before {
  content: "\e032";
}
.icon-stack-2:before {
  content: "\e033";
}
.icon-paper:before {
  content: "\e034";
}
.icon-paper-stack:before {
  content: "\e035";
}
.icon-search:before {
  content: "\e036";
}
.icon-zoom-in:before {
  content: "\e037";
}
.icon-zoom-out:before {
  content: "\e038";
}
.icon-reply:before {
  content: "\e039";
}
.icon-circle-plus:before {
  content: "\e040";
}
.icon-circle-minus:before {
  content: "\e041";
}
.icon-circle-check:before {
  content: "\e042";
}
.icon-circle-cross:before {
  content: "\e043";
}
.icon-square-plus:before {
  content: "\e044";
}
.icon-square-minus:before {
  content: "\e045";
}
.icon-square-check:before {
  content: "\e046";
}
.icon-square-cross:before {
  content: "\e047";
}
.icon-microphone:before {
  content: "\e048";
}
.icon-record:before {
  content: "\e049";
}
.icon-skip-back:before {
  content: "\e050";
}
.icon-rewind:before {
  content: "\e051";
}
.icon-play:before {
  content: "\e052";
}
.icon-pause:before {
  content: "\e053";
}
.icon-stop:before {
  content: "\e054";
}
.icon-fast-forward:before {
  content: "\e055";
}
.icon-skip-forward:before {
  content: "\e056";
}
.icon-shuffle:before {
  content: "\e057";
}
.icon-repeat:before {
  content: "\e058";
}
.icon-folder:before {
  content: "\e059";
}
.icon-umbrella:before {
  content: "\e060";
}
.icon-moon:before {
  content: "\e061";
}
.icon-thermometer:before {
  content: "\e062";
}
.icon-drop:before {
  content: "\e063";
}
.icon-sun:before {
  content: "\e064";
}
.icon-cloud:before {
  content: "\e065";
}
.icon-cloud-upload:before {
  content: "\e066";
}
.icon-cloud-download:before {
  content: "\e067";
}
.icon-upload:before {
  content: "\e068";
}
.icon-download:before {
  content: "\e069";
}
.icon-location:before {
  content: "\e070";
}
.icon-location-2:before {
  content: "\e071";
}
.icon-map:before {
  content: "\e072";
}
.icon-battery:before {
  content: "\e073";
}
.icon-head:before {
  content: "\e074";
}
.icon-briefcase:before {
  content: "\e075";
}
.icon-speech-bubble:before {
  content: "\e076";
}
.icon-anchor:before {
  content: "\e077";
}
.icon-globe:before {
  content: "\e078";
}
.icon-box:before {
  content: "\e079";
}
.icon-reload:before {
  content: "\e080";
}
.icon-share:before {
  content: "\e081";
}
.icon-marquee:before {
  content: "\e082";
}
.icon-marquee-plus:before {
  content: "\e083";
}
.icon-marquee-minus:before {
  content: "\e084";
}
.icon-tag:before {
  content: "\e085";
}
.icon-power:before {
  content: "\e086";
}
.icon-command:before {
  content: "\e087";
}
.icon-alt:before {
  content: "\e088";
}
.icon-esc:before {
  content: "\e089";
}
.icon-bar-graph:before {
  content: "\e090";
}
.icon-bar-graph-2:before {
  content: "\e091";
}
.icon-pie-graph:before {
  content: "\e092";
}
.icon-star:before {
  content: "\e093";
}
.icon-arrow-left:before {
  content: "\e094";
}
.icon-arrow-right:before {
  content: "\e095";
}
.icon-arrow-up:before {
  content: "\e096";
}
.icon-arrow-down:before {
  content: "\e097";
}
.icon-volume:before {
  content: "\e098";
}
.icon-mute:before {
  content: "\e099";
}
.icon-content-right:before {
  content: "\e100";
}
.icon-content-left:before {
  content: "\e101";
}
.icon-grid:before {
  content: "\e102";
}
.icon-grid-2:before {
  content: "\e103";
}
.icon-columns:before {
  content: "\e104";
}
.icon-loader:before {
  content: "\e105";
}
.icon-bag:before {
  content: "\e106";
}
.icon-ban:before {
  content: "\e107";
}
.icon-flag:before {
  content: "\e108";
}
.icon-trash:before {
  content: "\e109";
}
.icon-expand:before {
  content: "\e110";
}
.icon-contract:before {
  content: "\e111";
}
.icon-maximize:before {
  content: "\e112";
}
.icon-minimize:before {
  content: "\e113";
}
.icon-plus:before {
  content: "\e114";
}
.icon-minus:before {
  content: "\e115";
}
.icon-check:before {
  content: "\e116";
}
.icon-cross:before {
  content: "\e117";
}
.icon-move:before {
  content: "\e118";
}
.icon-delete:before {
  content: "\e119";
}
.icon-menu:before {
  content: "\e120";
}
.icon-archive:before {
  content: "\e121";
}
.icon-inbox:before {
  content: "\e122";
}
.icon-outbox:before {
  content: "\e123";
}
.icon-file:before {
  content: "\e124";
}
.icon-file-add:before {
  content: "\e125";
}
.icon-file-subtract:before {
  content: "\e126";
}
.icon-help:before {
  content: "\e127";
}
.icon-open:before {
  content: "\e128";
}
.icon-ellipsis:before {
  content: "\e129";
}

</style>
