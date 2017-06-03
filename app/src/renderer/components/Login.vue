<template>
  <div class="login-wrapper">
    <p><v-btn @click.native="openFbWindow" class="white--text indigo darken-1 fb-login" >
      Login with Facebook
    </v-btn></p>
    <p><v-switch label="Login as a different user" primary v-model="newUser" dark class="new-user" light /></p>
  </div>
</template>

<script>
  // import CurrentPage from './LandingPageView/CurrentPage'
  // import Links from './LandingPageView/Links'
  // import Versions from './LandingPageView/Versions'
  import FBLogin from '../services/FBLoginHelper'
  export default {
    data () {
      return {
        newUser: false
      }
    },
    methods: {
      openFbWindow () {
        FBLogin.startLogin(this.newUser, (error, response) => {
          if (error) console.log(error)
          localStorage.tinderKnows = JSON.stringify(response)
          location.reload()
        })
      }
    },
    name: 'login'
  }
</script>

<style scoped>
  p {
    text-align: center;
    
  }
  .login-wrapper {
    height: calc(100vh - 140px);
  }
  .fb-login, .new-user {
    width: 250px;
  }
  .fb-login {
    margin-top: 200px;
  }
  .new-user {
    margin-left: auto;
    margin-right: auto;
  }
</style>
