<template>
  <div class="cf">
    <div class="block">
        <p class="digit">{{ hours }} :</p>
    </div>
    <div class="block">
        <p class="digit">{{ minutes }} :</p>
    </div>
    <div class="block">
        <p class="digit">{{ seconds }}</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'countdown',
    mounted () {
      window.setInterval(() => {
        this.now = Math.trunc((new Date()).getTime() / 1000)
      }, 1000)
    },
    props: ['date'],
    data () {
      return {
        now: Math.trunc((new Date()).getTime() / 1000)
      }
    },
    computed: {
      seconds () {
        let sec = ((this.date - this.now) % 60).toString()
        if (sec.length < 2) {
          sec = '0' + sec
        }
        return sec
      },
      minutes () {
        let min = (Math.trunc((this.date - this.now) / 60) % 60).toString()
        if (min.length < 2) {
          min = '0' + min
        }
        return min
      },
      hours () {
        return Math.trunc((this.date - this.now) / 60 / 60) % 24
      }
    }
  }
</script>

<style scoped>
.block {
    margin: 0px;
    float: left;
}
.digit {
    color: #ecf0f1;
    margin: 3px;
    text-align: center;
}

</style>
