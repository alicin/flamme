<template>
  <div>
    <line-chart :labels="dailyW.labels" :data="dailyW.data" label="matches per day" did="ch-dw"></line-chart>
    <line-chart :labels="hourly.labels" :data="hourly.data" label="matches per hour" did="ch-h"></line-chart>
  </div>
</template>

<script>
  import LineChart from './Charts/LineChart'
  import Data from '../services/Data'
  export default {
    name: 'analyze',
    components: {LineChart},
    data () {
      return {
        dailyM: false,
        dailyW: false,
        hourly: false
      }
    },
    methods: {
    },
    beforeMount () {
      this.dailyW = Data.getMatchDataByDayOfTheWeek()
      this.dailyM = Data.getMatchDataByDayOfTheMonth()
      this.hourly = Data.getMatchDataByHourOfDay()
    },
    mounted () {
    }
  }
</script>

<style scoped>
  
</style>
