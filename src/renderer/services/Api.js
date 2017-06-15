const client = new TinderClient()
client.setAuthToken(localStorage.tinderToken)

window.getHomeUrl = function () {
  return process.env.NODE_ENV === 'development'
  ? `http://localhost:${require('../../../config').port}`
  : `file://${__dirname}/index.html`
}

export default class Api {
  static authorize (callback) {
    client.authorize(localStorage.fbToken, localStorage.fbUserId, callback)
  }

  static getAuthToken () {
    return client.getAuthToken()
  }

  static profile (callback) {
    client.getAccount(apiCallback(callback))
  }

  static history (callback) {
    client.getHistory(apiCallback(callback))
  }

  static unmatch (id, callback) {
    client.unmatch(id, apiCallback(callback))
  }

  static getUser (id, callback) {
    client.getUser(id, apiCallback(callback))
  }

  static like (id, callback) {
    client.like(id, apiCallback(callback))
  }

  static superLike (id, callback) {
    client.superLike(id, apiCallback(callback))
  }

  static pass (id, callback) {
    client.pass(id, apiCallback(callback))
  }

  static sendMessage (id, message, callback) {
    client.sendMessage(id, message, apiCallback(callback))
  }

  static getUpdates (callback) {
    client.getUpdates(callback)
  }

  static getCards (callback) {
    client.getRecommendations(20, apiCallback(callback))
  }

  static updatePosition (lon, lat, callback) {
    client.updatePosition(lon, lat, apiCallback(callback))
  }
}

function apiCallback (callback) {
  return function (error, response) {
    const unauthorized = [401, 403]
    if (error) {
      if (unauthorized.indexOf(error.status) > -1) {
        clearStorage()
      }
    }
    if (callback) {
      callback(error, response)
    }
  }
}

function clearStorage () {
  for (var prop in localStorage) {
    if (localStorage.hasOwnProperty(prop)) {
      if (prop !== 'history') {
        localStorage.removeItem(prop)
      }
    }
  }
  if (!localStorage.length > 1) {
    window.location.href = window.getHomeUrl()
  }
}

/**
 * Credit goes to https://github.com/alkawryk/tinderjs/
 * for the rest of the code.
 * TODO: encapsulate this :(
*/

var TINDER_HOST = 'https://api.gotinder.com/'
var TINDER_IMAGE_HOST = 'https://imageupload.gotinder.com/'

var request = require('superagent')

/**
 * Constructs a new instance of the TinderClient class
 *
 * @constructor
 * @this {TinderClient}
 */
function TinderClient () {
  var xAuthToken = null
  var fbID = null
  this.lastActivity = new Date()
  var _this = this

  /**
   * The current account's user id
   */
  this.userId = null

  /**
   * Helper for getting the request headers
   */
  var getRequestHeaders = function () {
    var headers = {
      'User-Agent': 'Tinder Android Version 6.5.1',
      'os-version': '23',
      'platform': 'android',
      'app-version': '1955',
      'Accept-Language': 'en'
    }

    if (xAuthToken) {
      headers['X-Auth-Token'] = xAuthToken
    }

    if (fbID) {
      headers['Facebook-ID'] = fbID
    }

    return headers
  }

  /**
   * Issues a GET request to the Tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderGet = function (path, data, callback) {
    request.get(TINDER_HOST + path)
      .set(getRequestHeaders())
      .end(callback)
  }

  /**
   * Issues a POST request to the Tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderPost = function (path, data, callback) {
    request.post(TINDER_HOST + path)
      .set(getRequestHeaders())
      .send(data)
      .end(callback)
  }

  /**
   * Issues a PUT request to the Tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderPut = function (path, data, callback) {
    request.put(TINDER_HOST + path)
      .set(getRequestHeaders())
      .send(data)
      .end(callback)
  }

  /**
   * Issues a DELETE request to the Tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderDelete = function (path, data, callback) {
    request.del(TINDER_HOST + path)
      .set(getRequestHeaders())
      .send(data)
      .end(callback)
  }

  /**
   * Helper for transforming the request callback values
   * @param {Function} callback the callback
   */
  var makeTinderCallback = function (callback) {
    return function (error, res) {
      var data = null

      if (!error) {
        if (typeof res.body === 'string') {
          try {
            data = JSON.parse(res.body)
          } catch (err) {
            error = data
          }
        } else if (typeof res.body === 'object') {
          data = res.body
        }
      }

      if (data && data.status && data.status !== 200) {
        error = data
      }

      if (callback) {
        callback(error, data)
      }
    }
  }

  /**
   * Authorize this tinder client
   * @param {String} fbToken the Facebook token. This will be obtained when authenticating the user
   * @param {String} fbId the Facebook user id.
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.authorize = function (fbToken, fbId, callback) {
    fbID = fbId
    var unirest = require('unirest')

    var req = unirest('POST', 'https://api.gotinder.com/auth')

    req.headers({
      'cache-control': 'no-cache',
      'app-version': '1955',
      'os-version': '23',
      'user-agent': 'Tinder Android Version 6.5.1',
      'platform': 'android',
      'content-type': 'application/json'
    })

    req.type('json')
    req.send({
      'facebook_token': 'EAAGm0PX4ZCpsBABlJ5xn4edX5mMnJHLylHNbtq5vJhY5GbpjMCM8EhkcVIKufnbgS3dOEdTunZB1I8ZBgwadiGnHjJltb3B3BOTNlUi15bGuA3kI9BIzjkBl7kjq0KMZCDql46V1kgaXOiyIvmkRWsa2WTc8sv6lxoYSGaMkAClZBwSZB3XZBLpqYaoIAZAxtkmhsYmQ1W7DGX4lBgTT2rtqLB7lIwTT0GvoJuxtSoiBwgZDZD',
      'facebook_id': '10152026682922548'
    })

    req.end(function (res) {
      xAuthToken = res.body.token
      callback(res.error, res, res.body)
    })
  }

  /**
   * Set auth token if you have it saved, no need to do fb login every time
   */
  this.setAuthToken = function (token) {
    xAuthToken = token
  }

  this.getAuthToken = function () {
    return xAuthToken
  }

  /**
   * Returns whether this client is authorized
   * @return whether or not this client is authorized
   */
  this.isAuthorized = function () {
    return xAuthToken != null
  }

  /**
   * Returns the xAuthToken
   * @return xAuthToken
   */
  this.getAuthToken = function () {
    return xAuthToken || null
  }

  /**
   * Returns client information and globals
   * Globals are used for interacting with tinder api limits
   */
  this.getDefaults = function () {
    return _this.defaults
  }

  /**
   * Gets a list of nearby users
   * @param {Number} limit the maximum number of profiles to fetch
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getRecommendations = function (limit, callback) {
    tinderGet('user/recs',
      {
        limit: limit
      },
      makeTinderCallback(callback))
  }

  /**
   * Sends a message to a user
   * @param {String} matchId the id of the match
   * @param {String} message the message to send
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.sendMessage = function (matchId, message, callback) {
    tinderPost('user/matches/' + matchId,
      {
        message: message
      },
      makeTinderCallback(callback))
  }

  /**
   * Likes (swipes right) on a user
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.like = function (userId, callback) {
    tinderGet('like/' + userId,
      null,
      makeTinderCallback(callback))
  }

  /**
   * Superlikes a user
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.superLike = function (userId, callback) {
    tinderPost('like/' + userId + '/super',
      null,
      makeTinderCallback(callback))
  }

  /**
   * Passes (swipes left) on a user
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.pass = function (userId, callback) {
    tinderGet('pass/' + userId,
      null,
      makeTinderCallback(callback))
  }

  /**
   * Unmatch with a user
   * @param {String} matchID the id of the match
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.unmatch = function (matchId, callback) {
    tinderDelete('user/matches/' + matchId,
      null,
      makeTinderCallback(callback))
  }

  /**
   * Gets a list of new updates. This will be things like new messages, users who liked you, etc.
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getUpdates = function (callback) {
    tinderPost('updates',
      {
        last_activity_date: _this.lastActivity.toISOString()
      },
      makeTinderCallback(function (err, data) {
        if (data && data.last_activity_date) {
          _this.lastActivity = new Date(data.last_activity_date)
        }

        if (callback) {
          callback(err, data)
        }
      }))
  }

  /**
   * Gets the entire history for the current account (all matches, messages, blocks, etc.)
   *
   * NOTE: Old messages seem to not be returned after a certain threshold. Not yet
   * sure what exactly that timeout is. The official client seems to get this update
   * once when the app is installed then cache the results and only rely on the
   * incremental updates
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getHistory = function (callback) {
    tinderPost('updates',
      {
        last_activity_date: ''
      },
      makeTinderCallback(callback))
  }

  /**
   * Updates the geographical position for the current account
   * @param {Number} lon the longitude
   * @param {Number} lat the latitutde
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updatePosition = function (lon, lat, callback) {
    tinderPost('user/ping',
      {
        lon: lon,
        lat: lat
      },
      makeTinderCallback(callback))
  }

  /**
   * Gets the current account info
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getAccount = function (callback) {
    var unirest = require('unirest')

    var req = unirest('GET', 'https://api.gotinder.com/meta')

    req.headers({
      'cache-control': 'no-cache',
      'app-version': '1955',
      'x-auth-token': xAuthToken,
      'os-version': '23',
      'user-agent': 'Tinder Android Version 6.5.1',
      'platform': 'android',
      'content-type': 'application/json'
    })

    req.end(function (res) {
      callback(res.error, res.body)
    })
  }

  /**
   * Update your gender
   * @param {Number} gender is your gender (0 = Male, 1 = Female)
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updateGender = function (gender, callback) {
    tinderPost('profile',
      {
        gender: gender
      },
      makeTinderCallback(callback))
  }

  /**
   * Update your bio
   * @param {String} bio is you bio (500 characters max.)
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updateBio = function (bio, callback) {
    tinderPost('profile',
      {
        bio: bio
      },
      makeTinderCallback(callback))
  }

  /**
   * Update your job
   * @param {String} id is the facebook id of the job
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updateJob = function (id, callback) {
    tinderPut('profile/job',
      {
        'company': {
          id: id
        }
      },
      makeTinderCallback(callback))
  }

  /**
   * Delete your current job
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.deleteJob = function (callback) {
    tinderDelete('profile/job',
      null,
      makeTinderCallback(callback))
  }

  /**
   * Update your school
   * @param {String} id is the facebook id of the school
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updateSchool = function (id, callback) {
    tinderPut('profile/school',
      {
        schools: [{
          id: id
        }]
      },
      makeTinderCallback(callback))
  }

  /**
   * Delete your current school
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.deleteSchool = function (callback) {
    tinderDelete('profile/school',
      null,
      makeTinderCallback(callback))
  }

  /**
   * Updates the preferences for the current account
   * @param {Boolean} discovery whether or not to show user's card
   * @param {Number} ageMin the minimum age to show recommendations
   * @param {Number} ageMax the maximum age to show recommendations
   * @param {Number} gender the gender to show recommentations (0 = Male, 1 = Female, -1 = Both)
   * @param {Number} distance the distance in miles to show recommendations
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updatePreferences = function (discovery, ageMin, ageMax, gender, distance, callback) {
    tinderPost('profile',
      {
        discoverable: discovery,
        age_filter_min: ageMin,
        age_filter_max: ageMax,
        gender_filter: gender,
        distance_filter: distance
      },
      makeTinderCallback(callback))
  }

  /**
   * Delete the current account
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.deleteAccount = function (callback) {
    tinderDelete('profile',
      null,
      makeTinderCallback(callback))
  }

  /**
   * Gets a user by id
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getUser = function (userId, callback) {
    tinderGet('user/' + userId,
      null,
      makeTinderCallback(callback))
  }

  /**
   * Upload a new picture to the current account
   * @param {Buffer} file the picture that you want to upload
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.uploadPicture = function (file, callback) {
    request.post(TINDER_IMAGE_HOST + 'image?client_photo_id=ProfilePhoto' +
                 new Date().getTime())
      .set(getRequestHeaders())
      .field('userId', _this.userId)
      .attach('file', file)
      .end(makeTinderCallback(callback))
  }

  /**
   * Post a new picture to the current account from Facebook
   * @param {String} pictureId is the facebook id of the picture
   * @param {Float} xdistance_percent is the zoom percentage in x 0 full Zoom 1 no Zoom
   * @param {Float} ydistance_percent is the zoom percentage in x 0 full Zoom 1 no Zoom
   * @param {Float} xoffset_percent is the offset from the left corner in percentage
   * @param {Float} yoffset_percent is the offset from the top corner in percentage
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.uploadFBPicture = function (pictureId, xdistance_percent, ydistance_percent, xoffset_percent, yoffset_percent, callback) {
    tinderPost('media',
      {
        transmit: 'fb',
        assets: [{
          ydistance_percent: ydistance_percent,
          id: id,
          xoffset_percent: xoffset_percent,
          yoffset_percent: yoffset_percent,
          xdistance_percent: xdistance_percent
        }]
      },
      makeTinderCallback(callback))
  }

  /**
   * Delete a picture from the current account
   * @param {String} pictureId the id of the picture
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.deletePicture = function (pictureId, callback) {
    tinderDelete('media',
      {
        assets: [pictureId]
      },
      makeTinderCallback(callback))
  }

  /**
   * Get a share URL for a user
   *
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getShareLink = function (userId, callback) {
    tinderPost('user/' + userId + '/share',
      null,
      makeTinderCallback(callback))
  }

  /**
   * Report a user
   *
   * @param {String} userId the id of the user
   * @param {Number} causeId one of 4 (inappropriate photos), 1 (spam), or 0 (other)
   * @param {String} causeText optional reason for report when causeId is 0 (other)
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.report = function (userId, causeId, causeText, callback) {
    var data = {
      cause: causeId
    }
    if (causeId == 0 && causeText != null) data['text'] = causeText
    tinderPost('report/' + userId,
      data,
      makeTinderCallback(callback))
  }

  /**
   * Create a web username for the current account
   *
   * @param {String} userName the username to request be created
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.createUsername = function (username, callback) {
    tinderPost('profile/username',
      {
        username: username
      },
      makeTinderCallback(callback))
  }

  /**
   * Change a web username for the current account if it's already been set
   *
   * @param {String} userName the username to request be created
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.changeUsername = function (username, callback) {
    tinderPut('profile/username',
      {
        username: username
      },
      makeTinderCallback(callback))
  }

  /**
   * Deletes the existing web username for the current account
   *
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.deleteUsername = function (callback) {
    tinderDelete('profile/username',
      null,
      makeTinderCallback(callback))
  }

  /// ////////// TINDER PLUS /////////////////

  /**
   * Update the passport location
   * @param {Number} lon the longitude
   * @param {Number} lat the latitutde
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updatePassport = function (lat, lon, callback) {
    tinderPost('/passport/user/travel',
      {
        lon: lon,
        lat: lat
      },
      makeTinderCallback(callback))
  }

  /**
   * Reset the passport location
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.resetPassport = function (callback) {
    tinderPost('/passport/user/reset',
      null,
      makeTinderCallback(callback))
  }

  /**
   * @deprecated
   * Get authenticated user info
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getProfile = function (callback) {
    console.log('This function is deprecated. Use getAccount(callback) instead.')
    return this.getAccount(callback)
  }
}
