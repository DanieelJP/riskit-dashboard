<template>
  <div class="chartjs-box">
    <div class="info">
      <h4>{{ title }}</h4>
      <p>{{ description }}</p>
    </div>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
Chart.register(...registerables);

// Props tipados
interface Props {
  labels:      string[];
  values:      number[];
  title:       string;
  description: string;
}
const props = defineProps<Props>();

const chartRef = ref<HTMLCanvasElement|null>(null);
let chartInstance: Chart<'doughnut', number[], string> | null = null;

// Función para (re)inicializar el chart con los props
function initChart() {
  if (!chartRef.value) return;
  chartInstance?.destroy();
  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels: props.labels,
      datasets: [{
        label: props.title,
        data: props.values,
        backgroundColor: [
          '#0396FFaa',
          '#6be084aa',
          '#e78f30aa',
          '#d65db1aa',
          '#EE9AE5aa',
          '#d65656'
        ],
        borderWidth: 2,
        borderColor: '#1E1E1E'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            color: '#ccc',
            boxWidth: 12,
            padding: 16
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const total = ctx.dataset.data.reduce((sum, val) => sum + val, 0);
              const value = ctx.parsed;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${ctx.label}: ${value} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold'
          },
          formatter: (value, context) => {
            // Sum, val y total los detecta como posibles null
            const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${percentage}%`;
          }
        }
      }
    }
  });
}

// (Re)dibujar al montar y cuando cambien labels/values
onMounted(initChart);
watch([() => props.labels, () => props.values], initChart);
onBeforeUnmount(() => chartInstance?.destroy());
</script>

<style scoped>
.chartjs-box {
  width: 100%;
  height: 100%;
  background: #1E1E1E;
  border-radius: 5px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.info {
  text-align: center;
  margin-bottom: 1rem;
}
.info h4 {
  margin: 0; font-size: 1.1rem; color: #fff;
}
.info p {
  margin: 0; font-size: 0.85rem; color: #aaa;
}
</style>
