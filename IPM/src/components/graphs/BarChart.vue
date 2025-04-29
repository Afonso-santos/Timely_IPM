<template>
    <div>
      <Bar
        :id="chartId"
        :options="chartOptions"
        :data="chartData"
        class="w-full h-full"
      />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import { Bar } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ChartData
  } from 'chart.js'
  import ChartDataLabels from 'chartjs-plugin-datalabels'
  
  // Register required components globally
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ChartDataLabels
  )
  
  export default defineComponent({
    name: 'BarChart',
    components: { Bar },
    props: {
      chartId: {
        type: String,
        default: 'bar-chart-id'
      },
      chartData: {
        type: Object as () => ChartData<'bar', number[], string>,
        required: true
      }
    },
    data() {
      return {
        chartOptions: {
          responsive: true,
          layout: {
            padding: {
              left: 20,
              right: 20
            }
          },
          borderSkipped: false,
          borderRadius: 10,
          plugins: {
            tooltip: {
              enabled: false
            },
            legend: {
              display: false
            },
            datalabels: {
              anchor: 'end',
              align: 'end',
              offset: -35,
              font: {
                weight: 'medium',
                family: 'Space Grotesk',
                size: 14,
              },
              color: "#024B78",
              clamp: true
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  family: 'Space Grotesk',
                  size: 14,
                  weight: 'bold',
                },
                color: "#024B78"
              },
              border: {
                color: "#024B78",
                width: 1,
              },
              offset: true
            },
            y: {
                min: -5,
                grid: {
                    display: false
                },
                ticks: {
                    display: false
                },
                border: {
                    display: false
                }
            }
          }
        }
      }
    }
  })
  </script>
  