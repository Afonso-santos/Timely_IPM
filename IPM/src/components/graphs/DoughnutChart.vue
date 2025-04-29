<template>
  <div class="relative w-full aspect-square overflow-visible">
  <Doughnut
      :id="chartId"
      :options="chartOptions"
      :data="chartData"
      class="w-full h-full"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  ChartData
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
)

export default defineComponent({
  name: 'DoughnutChart',
  components: { Doughnut },
  props: {
    chartId: {
      type: String,
      default: 'my-chart-id'
    },
    chartData: {
      type: Object as () => ChartData<'doughnut', number[], unknown>,
      required: true
    }
  },
  data() {
    return {
      maintainAspectRatio: false,
      chartOptions: {
        layout: {
          padding: {
            top: 160,
            bottom: 200,
            left: 90,
            right: 90
          }
        },
        responsive: true,
        plugins: {
          tooltip: {
            enabled: false
          },
          legend: {
            position: 'none'
          },
          datalabels: {
            color: (ctx: any) => {
              return ctx.dataset.backgroundColor[ctx.dataIndex]
            },
            formatter: (value: number, context: any) => {
              return value + "%\n" + context.chart.data.labels[context.dataIndex]
            },
            font: {
              weight: "bold",
              family: "Space Grotesk",
              size: "15px",
            },
            textAlign: "center",
            anchor: 'end',
            align: 'end',
            offset: 10,
            clamp: true
          }
        }
      }
    }
  }
})
</script>
