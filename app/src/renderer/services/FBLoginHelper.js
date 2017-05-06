import Request from 'request'
import tinder from 'tinder'

const BrowserWindow = window.require('electron').remote.BrowserWindow
const loginUrl = 'https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&state=%7B%22challenge%22%3A%22q1WMwhvSfbWHvd8xz5PT6lk6eoA%253D%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios'

const client = new tinder.TinderClient()

let fbAuthData = {}
let callback

var tinderLogin = function () {
  client.authorize(localStorage.fbToken, localStorage.fbUserId, function (error, response) {
    callback(error, response)
    if (error) { return console.log(error) }
    localStorage.tinderToken = client.getAuthToken()
    localStorage.name = response.user.full_name
    localStorage.smallPhoto = response.user.photos[0].processedFiles[3].url
    localStorage.userId = response.user._id
  })
}

var checkForToken = function (loginWindow, interval, callback) {
  var url = loginWindow.getURL()
  if (url === 'https://m.facebook.com/v2.6/dialog/oauth/confirm') {
    loginWindow.webContents.executeJavaScript("unescape(document.getElementsByTagName('script')[0].innerHTML)", false,
      function (result) {
        clearInterval(interval)
        loginWindow.close()
        getFBToken(result)
      })
  }
}

var getFBToken = function (result) {
  var tokenPattern = /access_token=(.*)&/
  var expirationPattern = /expires_in=(.*)/
  var token = result.match(tokenPattern)[1]
  var expiration = parseInt(result.match(expirationPattern)[1])
  fbAuthData['access_token'] = token
  localStorage.fbToken = fbAuthData['access_token']
  var now = Date.now()
  var expiryTime = new Date(now + (1000 * expiration))
  localStorage.fbTokenExpiresAt = expiryTime
  getFBUserId(fbAuthData['access_token'])
}

var getFBUserId = function (token) {
  var graphUrl = 'https://graph.facebook.com/me?access_token=' + token
  Request.get(graphUrl, {json: true}, (error, response, body) => {
    if (error) { return console.log(error) }
    localStorage.tinderAsks = JSON.stringify(body)
    fbAuthData['fb_id'] = body.id
    localStorage.fbUserId = fbAuthData['fb_id']
    tinderLogin()
  })
}

export default class FBLoginHelper {

  static startLogin (clear, cb) {
    callback = cb
    var userAgent = 'Mozilla/5.0 (Linux U en-gb KFTHWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.16 Safari/535.19'
    var win = new BrowserWindow({
      width: 700,
      height: 600,
      show: false,
      webPreferences: {
        nodeIntegration: false
      }
    })

    if (clear) {
      win.webContents.session.clearCache(() => {})
      win.webContents.session.clearStorageData()
    }

    win.setMenu(null)
    win.loadURL(loginUrl, { 'userAgent': userAgent })
    win.show()

    var interval = setInterval(function () {
      console.log('checking...')
      if (win) checkForToken(win, interval)
    }, 500)

    win.on('closed', function () {
      win = null
    })
  }

}
