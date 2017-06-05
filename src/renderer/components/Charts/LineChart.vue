<template>
  <div class="chart-wrapper">
    <canvas :id="this.did"></canvas>
  </div>
</template>

<script>
  import Chart from 'chart.js'

  export default {
    name: 'line-chart',
    props: ['labels', 'data', 'options', 'label', 'did'],
    data () {
      return {
        chart: false
      }
    },
    mounted () {
      var ctx = document.getElementById(this.did)
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            label: this.label,
            data: this.data,
            backgroundColor: [
              'rgba(255, 64, 129, 0.2)'
            ],
            borderColor: [
              'rgba(255, 64, 129, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: this.options
      })
    }
  }
</script> 

<style scoped>
  .chart-wrapper {
    padding: 20px;
  }
</style>
