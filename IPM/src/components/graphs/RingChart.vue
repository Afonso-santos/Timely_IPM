  <template>
    <div style="width: 160px; height: 160px;">
      <Doughnut
        :id="chartId"
        :options="chartOptions"
        :data="chartData"
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
    name: 'RingChart',
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
          responsive: true,
          radius: 60,
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
              formatter: (value: number, ctx: any) => {
                if (ctx.dataset.backgroundColor[ctx.dataIndex] == "#ffffff") {
                  return ''
                }
                return `${value}%`
              },
              font: {
                weight: "bold",
                family: "Space Grotesk",
                size: "15px",
              },
              textAlign: "center",
              anchor: 'end',
              align: 'end',
              offset: -78,
              clamp: true
            }
          }
        }
      }
    }
  })
  </script>
  