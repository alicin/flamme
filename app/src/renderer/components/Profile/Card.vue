<template>
  <li :data-index="index" class="clickable" @click="showProfile">
    <v-progress-circular 
    indeterminate 
    v-bind:size="70" 
    v-bind:width="4" 
    class="pink--text progress"
    />
    <img class="main-photo" draggable="false" :src="main" alt="">
    <h6>{{ match.name }}, {{ age }}<br>
    <span class="subtitle">{{ match.teaser.string }}</span></h6>
  </li>
</template>

<script>
  import ProfileDetail from './ProfileDetail'
  export default {
    props: ['match', 'index', 'main'],
    data () {
      return {
        imageIndex: 0
      }
    },
    components: {
      ProfileDetail
    },
    methods: {
      unmatch () {
        this.$parent.unmatch(this.index)
      },
      showProfile () {
        const modal = {
          userId: this.match._id,
          matchId: this.match._id
        }
        this.$root.modalController.push(modal)
      }
    },
    computed: {
      age: function () {
        return new Date().getFullYear() - this.match.birth_date.split('-')[0]
      }
    },
    name: 'card'
  }
</script>

<style scoped>
li {
  left: 70px;
  right: 70px;
  background: #fff;
  position: absolute;
  top: 100px;
  border-radius: 5px;
  overflow: hidden;
  transform: scale(0.9);
  background: #fff;
}
.progress {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -35px;
  margin-left: -35px;
  z-index: 1;
}
li:after {
  content: "";
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .4) 80%);
  z-index: 3;
}
li::nth-child(2) {
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.41);
}
li:last-child {
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.41);
  transform: scale(1);
  transition: all .3s;
}
.main-photo {
  display: block;
  width: 100%;
  height: auto;
  position: relative;
  z-index: 2;
}
h6 {
  color: #fff;
  position: absolute;
  bottom: 4px;
  left: 20px;
  z-index: 4;
}
.subtitle {
  font-weight: 400;
  font-size: 14px;
}
</style>
