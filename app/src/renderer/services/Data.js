import _ from 'underscore'
import moment from 'moment'
import Sync from './Sync'

export default class Data {

  static getMatchDataByDayOfTheWeek () {
    const matches = Sync.getMatches().matches
    const groups = _.groupBy(matches, function (match) {
      return moment(match.created_date).startOf('day').format('ddd')
    })

    let data = {
      labels: [],
      data: []
    }

    for (let key in groups) {
      data.labels.push(key)
      data.data.push(groups[key].length)
    }

    return data
  }

  static getMatchDataByDayOfTheMonth () {
    const matches = Sync.getMatches().matches
    const groups = _.groupBy(matches, function (match) {
      return moment(match.created_date).startOf('day').format('D')
    })

    let data = {
      labels: [],
      data: []
    }

    for (let key in groups) {
      data.labels.push(key)
      data.data.push(groups[key].length)
    }

    return data
  }

  static getMatchDataByHourOfDay () {
    const matches = Sync.getMatches().matches
    const groups = _.groupBy(matches, function (match) {
      return moment(match.created_date).startOf('hour').format('H')
    })

    let data = {
      labels: [],
      data: []
    }

    for (let key in groups) {
      data.labels.push(key)
      data.data.push(groups[key].length)
    }

    return data
  }

}

