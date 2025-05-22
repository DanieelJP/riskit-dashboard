<template>
  <div class="chart-container">
    <apexchart
      type="area"
      height="100%"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps<{
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}>();

const series = computed(() => [{
  name: props.data.datasets[0].label,
  data: props.data.datasets[0].data
}]);

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    categories: props.data.labels,
    labels: {
      style: {
        colors: '#666'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#666'
      }
    }
  },
  grid: {
    borderColor: '#f1f1f1',
    strokeDashArray: 4
  },
  tooltip: {
    theme: 'light'
  }
}));
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 