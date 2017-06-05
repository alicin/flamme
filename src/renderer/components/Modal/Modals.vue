<template>

  <div :class="{wrapper: true, open: visible}">
  <transition-group name="popin" tag="p">
      <div class="modal" :key="index" v-for="(modal, index) in modals">
        <chat :index="index" :matched="modal.match" v-if="modal.match"></chat>
        <profile :index="index" :id="modal.userId" :match-id="modal.matchId" v-if="modal.userId"></profile>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import Profile from './Profile'
  import Chat from './Chat'
  export default {
    name: 'modals',
    components: {
      Chat,
      Profile
    },
    data () {
      return {
        modals: [],
        visible: false
      }
    },
    methods: {
      push (modal) {
        this.modals.push(modal)
        this.visible = true
      },
      splice (index) {
        this.modals.splice(index, 1)
        if (!this.modals.length) {
          setTimeout(() => {
            this.visible = false
          }, 250)
        }
      }
    },
    mounted () {
      this.$root.modalController = this
    }
  }
</script>

<style scoped>
  .wrapper {
    position: fixed;
    z-index: -1;
  }
  .wrapper.open {
    z-index: 999;
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
  }

  .popin-enter-active {
    animation: pop-in .2s;
  }
  .popin-leave-active {
    animation: pop-out .2s;
  }
  @keyframes pop-in {
    0% {
      transform: translateY(40px);
      opacity: 0;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
  @keyframes pop-out {
    0% {
      transform: translateY(0px);
      opacity: 1;
    }
    100% {
      transform: translateY(40px);
      opacity: 0;
    }
  }
</style>
