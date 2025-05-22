<template>
  <div class="chart-container" ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps<{
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
}>();

const chartContainer = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;

const initChart = () => {
  if (!chartContainer.value) return;

  chart = echarts.init(chartContainer.value);
  updateChart();
};

const updateChart = () => {
  if (!chart) return;

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: props.data.labels
    },
    series: [
      {
        name: props.data.datasets[0].label,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: props.data.labels.map((label, index) => ({
          value: props.data.datasets[0].data[index],
          name: label,
          itemStyle: {
            color: props.data.datasets[0].backgroundColor[index]
          }
        }))
      }
    ]
  };

  chart.setOption(option);
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', () => {
    chart?.resize();
  });
});

watch(() => props.data, () => {
  updateChart();
}, { deep: true });
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 