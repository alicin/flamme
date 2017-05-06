<template>
  <div class="profile-modal" transition="v-slide-y-reverse-transition">
    <v-progress-circular 
    indeterminate 
    v-bind:size="70" 
    v-bind:width="4" 
    class="pink--text progress"
    v-if="!loaded"
    />
    <v-btn @click.native="close" icon="icon" class="white--text btn-close pink accent-3" >
      <v-icon>close</v-icon>
    </v-btn>

    <div class="profile-wrapper" v-if="profile">
      <div class="photos">
        <img class="profile-pic" :src="avatar || profile.photos[0].url" :alt="profile.name">
        <photos :photos="profile.photos" small="true" single="true"></photos>
      </div>

      <h6>{{ profile.name }}, {{ age }} <br> <span class="subtitle">{{ distance }} kilometers away</span></h6>
      <p class="bio">{{ profile.bio }}</p>
      
      <div class="spotify" v-if="profile.spotify_theme_track">
        <h6>Anthem</h6>
        <div class="anthem cf">
          <iframe :src="profile.spotify_theme_track.preview_url" v-if="spotifyPreview" frameborder="0" style="position: fixed;top: -50000px;"></iframe>
          <div class="track" @click="spotifyPreview = !spotifyPreview">
            <p class="song">{{ profile.spotify_theme_track.name }}<br>{{ profile.spotify_theme_track.album.name }}</p>
            <p class="artist">{{ profile.spotify_theme_track.artists[0].name }}</p>
          </div>
          <img :src="profile.spotify_theme_track.album.images[2].url" alt="" class="album-art">
        </div>
      </div>

      <div class="spotify-artists" v-if="profile.spotify_top_artists">
        <iframe :src="listPreviewUrl" v-if="listPreviewUrl" frameborder="0" style="position: fixed;top: -50000px;"></iframe>
        <h6>Top Artists</h6>
        <div class="anthem cf" v-for="artist in profile.spotify_top_artists">
          <div class="track" @click="setListPreview(artist.top_track.preview_url)">
            <p class="song">{{ artist.top_track.name }}<br>{{ artist.top_track.album.name }}</p>
            <p class="artist">{{ artist.top_track.artists[0].name }}</p>
          </div>
          <img :src="artist.top_track.album.images[2].url" alt="" class="album-art">
        </div>
      </div>

      <div class="friends" v-if="profile.common_connections.length">
        <h6>Mutual Friends</h6>
        <ul class="cf">
          <li v-for="friend in profile.common_connections">
            <img :src="friend.photo.large"> {{ friend.name }}
          </li>
        </ul>
      </div>

      <div class="instagram" v-if="profile.instagram">
        <h6>Instagram</h6>
        <div class="ig-profile">
          <img :src="profile.instagram.profile_picture" alt=""> {{ profile.instagram.username }}
        </div>
        <v-carousel>
          <v-carousel-item v-for="(photo, index) in profile.instagram.photos" :src="photo.image" :key="index" cycle="false" />
        </v-carousel>
      </div>

      <div class="interests" v-if="profile.common_interests.length">
        <h6>Common Interests</h6>
        <span class="interest" v-for="interest in profile.common_interests">{{ interest.name }}</span>
      </div>

    </div>

  </div>
</template>

<script>
  // import Moment from 'moment'
  import Api from '../../services/Api'
  import Photos from './Photos'
  export default {
    props: ['id', 'index'],
    data () {
      return {
        listPreviewUrl: '',
        spotifyPreview: false,
        avatar: false,
        profile: false,
        loaded: false
      }
    },
    components: {
      Photos
    },
    methods: {
      close () {
        if (this.$parent.$parent.profile) {
          this.$parent.$parent.profile = false
        } else if (this.$parent.profile) {
          this.$parent.profile = false
        }
      },
      unmatch () {
        this.$parent.unmatch(this.index)
      },
      setImage (url) {
        this.avatar = url
      },
      getProfile () {
        Api.getUser(this.id, (error, profile) => {
          if (error) { return console.log(error) }
          this.profile = profile.results
          console.log(this.profile)
          this.loaded = true
        })
      },
      setListPreview (url) {
        if (url === this.listPreviewUrl) {
          this.listPreviewUrl = ''
        } else {
          this.listPreviewUrl = url
        }
      }
    },
    computed: {
      age: function () {
        return new Date().getFullYear() - this.profile.birth_date.split('-')[0]
      },
      distance: function () {
        return Math.round(this.profile.distance_mi * 1.61)
      }
    },
    created () {
      this.getProfile()
    },
    name: 'profile-detail'
  }
</script>

<style scoped>
  .subtitle {
    font-size: 12px;
    color: #999;
  }
  .progress {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -35px;
    margin-left: -35px;
  }
  .profile-modal {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 9999;
    overflow: auto;
    padding-top: 30px;
  }
  .btn-close {
    position: fixed;
    top: 20px;
    right: 5px;
  }
  .profile-pic {
    width: 100%;
  }
  .profile-wrapper {
    margin: 0 10%;
  }
  .bio {
    white-space: pre-wrap; 
    line-height: 1.2;
    margin-bottom: 50px;
  }
  .anthem {
    width: 320px;
  }
  .track {
    float: left;
    margin-right: 20px;
    margin-bottom: 50px;
    line-height: 1.4em;
  }
  .song {
    margin-bottom: 5px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; 
    overflow: hidden; 
  }
  .artist {
    font-weight: bolder;
  }
  .album-art {
    float: right;
  }
  .instagram {
    margin-bottom: 50px;
  }
  .ig-profile {
    font-weight: bolder;
    margin-bottom: 20px;
  }
  .ig-profile img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 10px;
  }
  .interests, .friends {
    margin-bottom: 50px;
  }
  .interests h6 {
    margin-bottom: 15px;
  }
  .friends h6 {
    margin-bottom: 30px;
  }
  .interest {
    display: inline-block;
    border: 2px solid #f50057;
    color: #f50057;
    font-weight: bolder;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 4px;
    margin-bottom: 7px;
    border-radius: 3px;
  }
  .friends ul {
    list-style-type: none;
  }
  .friends ul li {
    text-align: center;
    width: 30%;
    margin-right: 3.3333333%;
    margin-bottom: 25px;
    float: left;
    font-weight: bolder;
    
  }
  .friends ul li:nth-child(3n) {
    margin-right: 0;
  }
  .friends ul img {
    display: block;
    width: 90%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
    border-radius: 50%;
  }
</style>
