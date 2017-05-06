<template>
<div>
  <h6 class="pink--text">Going Out</h6>
  <div class="go-container">
    <ul class="outs cf" :style="{ width: widthGo + 'px' }">
      <going-out v-for="out in goingout" v-if="out.match" :out="out"></going-out>
    </ul>
  </div>

  <h6 class="pink--text">Matches <v-switch label="Unmatch Mode" v-model="unmatchMode" error light hide-details /></h6>
  <div class="matches-container">
    <ul class="matches cf" :style="{ width: width + 'px' }">
      <match v-for="(match, index) in matches" :index="index" :match="match"></match>
    </ul>
  </div>

  <h6 class="pink--text">Chats</h6>
  <ul class="chats">
    <chat v-for="(chat, index) in chats" :index="index" :match="chat"></chat>
  </ul>
</div>
  
</template>

<script>
  import Api from '../services/Api'
  import Sync from '../services/Sync'
  import Match from './Matches/Match'
  import Chat from './Matches/Chat'
  import GoingOut from './Matches/GoingOut'
  export default {
    data () {
      return {
        unmatchMode: false,
        gol: 0,
        matches: [],
        chats: [],
        goingout: []
      }
    },
    components: {
      Match,
      Chat,
      GoingOut
    },
    computed: {
      width: function () {
        return this.matches.length * 145 + 30
      },
      widthGo: function () {
        return this.gol * 125 + 60
      }
    },
    methods: {

      getMatches () {
        let history = Sync.getMatches()
        console.log(history)
        var matches = []
        var chats = []
        var goingout = history.goingout.sort((a, b) => b.creation_date.localeCompare(a.creation_date))
        history.matches.sort((a, b) => b.last_activity_date.localeCompare(a.last_activity_date))
        .forEach((match) => {
          goingout.forEach((item) => {
            if (item.source_id === match._id) {
              item.match = match
              this.gol++
            }
          })

          if (match.messages.length) {
            chats.push(match)
          } else {
            matches.push(match)
          }
        })

        this.matches = matches
        this.chats = chats
        this.goingout = goingout
      },

      unmatch (index, id, type) {
        console.log(id)
        console.log(type)
        Api.unmatch(id, (error, response) => {
          if (error) { console.log(error) }
          if (type === 'chat') {
            this.chats.splice(index, 1)
          } else if (type === 'match') {
            this.matches.splice(index, 1)
          }
        })
      }

    },
    created () {
      setTimeout(() => {
        this.getMatches()
      }, 200)
    },
    mounted () {
      window.addEventListener('update', this.getMatches, false)
    },
    beforeDestroy () {
      window.removeEventListener('update', this.getMatches)
    },
    name: 'matches'
  }
</script>

<style scoped>
  h6 {
    margin-top: 30px;
    margin-left: 30px;
    margin-bottom: 20px;
  }
  .matches-container {
    overflow: scroll;
    height: 230px;
  }
  .matches, .outs {
    list-style-type: none;
  }
  .go-container {
    overflow: scroll;
    height: 190px;
  }
  .outs {
    padding-left: 30px;
    padding-right: 30px;
  }
</style>
