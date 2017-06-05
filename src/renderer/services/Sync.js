import _ from 'underscore'

export default class Sync {
  static checkMatches (payload) {
    const storage = SyncStorage.getStored()
    let notification = false

    if (storage.matches.length) {
      payload.matches.forEach(function (match) {
        const storedMatch = _.findWhere(storage.matches, {_id: match._id})
        const event = new CustomEvent('message', { 'detail': match })
        if (!storedMatch) {
          match.new = true
          notification = true
        } else {
          match.new = storedMatch.new

          if (match.messages && !storedMatch.messages) {
            match.newMessage = true
            notification = true
            window.dispatchEvent(event)
          } else if (match.messages && storedMatch.messages) {
            if (match.messages.length > storedMatch.messages.length) {
              match.newMessage = true
              notification = true
              window.dispatchEvent(event)
            } else {
              match.newMessage = storedMatch.newMessage
            }
          }
        }
      })
    }

    SyncStorage.setStored(payload)
    return notification
  }

  static getMatches () {
    return SyncStorage.getStored()
  }

  static addNewMatch (match) {
    match.new = true
    var stored = SyncStorage.getStored()
    stored.matches.unshift(match)
    SyncStorage.setStored(stored)
  }

  static addNewMessage (matchId, messages) {
    var stored = SyncStorage.getStored()
    for (var i = 0; i < stored.matches.length; i++) {
      if (stored.matches[i]._id === matchId) {
        stored.matches[i].messages = messages
        break
      }
    }
    SyncStorage.setStored(stored)
  }

  static unsetNew (matchId) {
    var stored = SyncStorage.getStored()
    for (var i = 0; i < stored.matches.length; i++) {
      if (stored.matches[i]._id === matchId) {
        stored.matches[i].new = false
        stored.matches[i].newMessage = false
        break
      }
    }
    SyncStorage.setStored(stored)
  }
}

class SyncStorage {
  static getStored () {
    if (localStorage.history) {
      return JSON.parse(localStorage.history)
    } else {
      return {matches: [], goingout: []}
    }
  }

  static setStored (data) {
    localStorage.history = JSON.stringify(data)
  }
}
