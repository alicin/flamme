import Request from 'request'
import Api from './Api'

const BrowserWindow = window.require('electron').remote.BrowserWindow
const loginUrl = 'https://m.facebook.com/v2.8/dialog/oauth?auth_type=rerequest&client_id=464891386855067&default_audience=friends&display=touch&e2e=%7B%22init%22:1947351.737793%7D&fbapp_pres=0&redirect_uri=fb464891386855067://authorize/&response_type=token,signed_request&return_scopes=true&scope=user_birthday,user_photos,user_education_history,email,user_relationship_details,user_friends,user_work_history,user_likes&sdk=ios&sdk_version=4.20.2&state=%7B%22challenge%22:%22wt7ktcsTn66e3eXP5hkB6OiZHG0%253D%22,%220_auth_logger_id%22:%22A5AA6F71-41B8-4D04-9896-7E6A2FC26295%22,%22com.facebook.sdk_client_state%22:true,%223_method%22:%22sfvc_auth%22%7D&sfvc=1'

let fbAuthData = {}
let callback

var tinderLogin = function () {
  Api.authorize(function (error, response) {
    callback(error, response)
    if (error) { return console.log(error) }
    localStorage.tinderToken = Api.getAuthToken()
    localStorage.name = response.user.full_name
    localStorage.smallPhoto = response.user.photos[0].processedFiles[3].url
    localStorage.userId = response.user._id
  })
}

var checkForToken = function (loginWindow, interval, callback) {
  var url = loginWindow.getURL()
  if (url.indexOf('https://m.facebook.com/v2.8/dialog/oauth/confirm') > -1) {
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
      localStorage.clear()
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
