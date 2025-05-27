<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import Chart from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';

const props = defineProps<{
  data: number[];
  labels: string[];
  colors: string[];
  title?: string;
  description?: string;
}>();

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: any = null;

const createChart = () => {
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  const total = (props.data as number[]).reduce((sum, val) => sum + val, 0);
  const percentages = props.data.map(value => ((value / total) * 100).toFixed(1) + '%');

  const config: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data: {
      labels: props.labels,
      datasets: [{
        data: props.data,
        backgroundColor: props.colors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.raw as number;
              const percentage = percentages[context.dataIndex];
              return `${label}: ${value} (${percentage})`;
            }
          }
        }
      }
    }
  };

  chart = new Chart(ctx, config);
};

onMounted(() => {
  createChart();
});

watch(() => props.data, () => {
  if (chart) {
    chart.destroy();
  }
  createChart();
}, { deep: true });

watch(() => props.labels, () => {
  if (chart) {
    chart.destroy();
  }
  createChart();
}, { deep: true });

watch(() => props.colors, () => {
  if (chart) {
    chart.destroy();
  }
  createChart();
}, { deep: true });

onBeforeUnmount(() => chart?.destroy());
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
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
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
}

.info p {
  margin: 0;
  font-size: 0.85rem;
  color: #aaa;
}
</style>
