<template>
    <div class="box-realTimeChart">
      <VueApexCharts height="100%" :options="chartOptions" :series="series" />
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  
  // Props
  const props = defineProps<{
    series: { name: string; data: { x: number; y: number }[] }[];
    title?: string;
    kpiTarget?: number;
    color?: string;
  }>();
  
  
  // Valores por defecto
  const title = computed(() => props.title ?? '📡 Gráfico Tiempo Real');
  const chartColor = computed(() => props.color ?? '#34A72A');
  const kpiTarget = computed(() => props.kpiTarget ?? 75);
  
  
  // Opciones del gráfico
  const chartOptions = computed(() => ({
    chart: {
      id: 'realtime',
      type: 'bar',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    colors: [chartColor.value],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100],
      },
    },
    title: {
      text: title.value,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#8C8C8C',
      },
    },
    markers: {
      size: 0,
      hover: { size: 4, sizeOffset: 3 },
    },
    xaxis: {
      type: 'datetime',
      range: 10000,
      labels: {
        style: { colors: '#8C8C8C' },
        datetimeFormatter: {
          hour: 'HH:mm',
          minute: 'HH:mm:ss',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      max: 100,
      tickAmount: 5,
      forceNiceScale: true,
      labels: { style: { colors: '#8C8C8C' } },
    },
    legend: { show: false },
    tooltip: {
      x: { format: 'HH:mm:ss' },
      theme: 'dark',
    },
    grid: {
      borderColor: '#334155',
      strokeDashArray: 5,
      padding: { left: 10, right: 10 },
    },
    annotations: {
      yaxis: [
        {
          y: kpiTarget.value,
          borderColor: chartColor.value,
          label: {
            borderColor: chartColor.value,
            style: { color: '#fff', background: chartColor.value },
            text: `KPI - ${kpiTarget.value}`,
          },
        },
      ],
    },
  }));
  </script>
  
  
  <style scoped>
  .box-realTimeChart {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 290px;
    width: 100%;
    padding: 16px;
  }
  </style>
  