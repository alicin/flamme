import tinder from 'tinder'
const client = new tinder.TinderClient()
client.setAuthToken(localStorage.tinderToken)

export default class Api {

  static profile (callback) {
    client.getAccount((error, response) => {
      callback(error, response)
    })
  }

  static history (callback) {
    client.getHistory(callback)
  }

  static unmatch (id, callback) {
    client.unmatch(id, callback)
  }

  static getUser (id, callback) {
    client.getUser(id, callback)
  }

  static like (id, callback) {
    client.like(id, callback)
  }

  static pass (id, callback) {
    client.pass(id, callback)
  }

  static sendMessage (id, message, callback) {
    client.sendMessage(id, message, callback)
  }

  static getUpdates (callback) {
    client.getUpdates(callback)
  }

  static getCards (callback) {
    client.getRecommendations(20, callback)
  }
}
