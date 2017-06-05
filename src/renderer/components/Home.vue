<template>
  <div class="cf">
    <div class="left profile-wrapper">
      <img class="profile-pic" :src="avatar" :alt="name">
      <p class="username">{{ name }}</p>
      <p class="travel-info pink--text bold" v-if="travel.is_traveling">
        {{ travel.travel_location_info[0].locality.long_name }},
        {{ travel.travel_location_info[0].administrative_area_level_1.long_name }},
        {{ travel.travel_location_info[0].country.long_name }}
      </p>
      <p><v-btn small error light @click.native="logout">Logout</v-btn></p>
    </div>
    <div class="right settings-wrapper">
      <photos :photos="photos"></photos>
      <div class="details">
        <h6>Bio</h6>
        <p style="white-space: pre-wrap; line-height: 1.2;">{{ user.bio }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import Api from '../services/Api'
  import Photos from './Profile/Photos'
  export default {
    data () {
      return {
        avatar: '',
        travel: {},
        photos: [],
        user: {},
        name: ''
      }
    },
    components: {
      Photos
    },
    methods: {
      getProfile () {
        Api.profile((error, profile) => {
          if (error) {
            console.log(error)
            this.$router.push('/')
            this.$parent.e1 = 1
            return
          }
          console.log(profile)
          this.user = profile.user
          this.avatar = profile.user.photos[0].url
          this.name = profile.user.name
          this.travel = profile.travel
          this.photos = profile.user.photos
          this.$root.profile = profile
          this.$root.likes_remaining = profile.rating.likes_remaining
          this.$root.super_likes_remaining = profile.rating.super_likes.remaining
          this.$root.rate_limited_until = profile.rating.rate_limited_until / 1000
          this.$root.super_likes_resets_at = Math.round(new Date(profile.rating.super_likes.resets_at).getTime() / 1000)
        })
      },
      logout () {
        localStorage.clear()
        location.reload()
      }
    },
    created () {
      this.getProfile()
    },
    name: 'home'
  }
</script>

<style scoped>
  .profile-pic {
    width: 70%;
    height: auto;
    border-radius: 50%;
    margin-top: 15px;
    margin-bottom: 10px;
  }
  .username {
    font-weight: bolder;
    font-size: 20px;
  }
  .profile-wrapper {
    width: 35%;
    text-align: center;
  }
  .settings-wrapper {
    padding-top: 20px;
    width: 65%;
  }
  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
