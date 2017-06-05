import tinder from 'tinder'
const client = new tinder.TinderClient()
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
