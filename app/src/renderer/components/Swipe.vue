<template>
  <div tabindex="-1" id="swiper" @keyup.left="pass" @keyup.right="like" @keyup.up="prevImage" @keyup.down="nextImage">
    <ul class="card-stack">
      <card v-for="(card, index) in cards" :match="card" :index="index" :main="card.photos[0].url"></card>
    </ul>
  </div>
</template>

<script>
  import Api from '../services/Api'
  import Sync from '../services/Sync'
  import Card from './Profile/Card'
  let swipeInProgress = false
  let cardsInProgress = false
  let focusInterval
  export default {
    data () {
      return {
        cards: []
      }
    },
    components: {
      Card,
      Api
    },
    methods: {
      pass () {
        if (swipeInProgress || !this.$children[this.cards.length - 1]) return
        if (this.cards.length === 2 || this.cards.length === 1) {
          this.getCards()
        }
        this.$root.modalController.modals = []
        swipeInProgress = true
        const child = this.$children[this.cards.length - 1]
        child.$el.style.transform = 'translateX(-470px)'
        child.$el.style.opacity = 0
        Api.pass(child.match._id, function (error, message) {
          if (error) console.log(error)
          console.log(message)
        })
        setTimeout(() => {
          this.cards.splice(-1)
          swipeInProgress = false
        }, 200)
      },
      like () {
        if (swipeInProgress || !this.$children[this.cards.length - 1]) return
        if (this.cards.length === 2 || this.cards.length === 1) {
          this.getCards()
        }
        this.$root.modalController.modals = []
        swipeInProgress = true
        const child = this.$children[this.cards.length - 1]
        child.$el.style.transform = 'translateX(470px)'
        child.$el.style.opacity = 0
        Api.like(child.match._id, (error, message) => {
          if (error) console.log(error)
          console.log(message)
          if (message.match) {
            message.match.person = child.match
            Sync.addNewMatch(message.match)
            alert('It\'s a match!!')
            var event = new Event('update')
            window.dispatchEvent(event)
          }
          if (message.likes_remaining) {
            this.$root.likes_remaining = message.likes_remaining
          }
        })
        setTimeout(() => {
          this.cards.splice(-1)
          swipeInProgress = false
        }, 200)
      },
      nextImage () {
        if (swipeInProgress || !this.$children[this.cards.length - 1]) return
        const child = this.$children[this.cards.length - 1]
        if (child.imageIndex === child.match.photos.length - 1) {
          child.imageIndex = 0
        } else {
          child.imageIndex++
        }

        child.mainPhoto = child.match.photos[child.imageIndex].url
      },
      getCards () {
        // TODO: superlike
        // TODO: image change up down
        // TODO: boost timer in top bar
        // TODO: no recs check
        if (cardsInProgress) { return }
        cardsInProgress = true
        console.log('fetching cards..')
        Api.getCards((error, response) => {
          cardsInProgress = false
          if (error) {
            console.log(error)
            localStorage.clear()
            this.$router.push('/')
            this.$parent.e1 = 1
            return
          }
          console.log(response)
          if (response.results) {
            this.cards = response.results.concat(this.cards)
          }
        })
      }
    },
    mounted () {
      window.element = this
      this.getCards()
      document.getElementById('swiper').focus()
      focusInterval = setInterval(() => {
        document.getElementById('swiper').focus()
      }, 500)
    },
    beforeDestroy () {
      clearInterval(focusInterval)
    },
    name: 'swipe'
  }
</script>

<style scoped>
.card-stack {
  list-style-type: none;
  background: #999
}

</style>
