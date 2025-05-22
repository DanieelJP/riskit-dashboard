<template>
  <VEChart class="gauge-ring-chart" :option="chartOptions" autoresize />
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { use } from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, TitleComponent } from 'echarts/components';
import VEChart from 'vue-echarts';

use([GaugeChart, CanvasRenderer, TooltipComponent, TitleComponent]);

// Props ✨
const props = withDefaults(
  defineProps<{
    segments: {
      value: number;
      name?: string;
      color?: string;
    }[];
  }>(),
  {
    segments: () => [
      { value: 500, name: 'Descargas', color: '#3b82f6' },
      { value: 300, name: 'Subidas', color: '#10b981' }
    ]
  }
);

// Configuración del gráfico
const chartOptions = computed(() => {
  const maxValue = 1000; // Rango máximo de 1000 (Mbps)

  // Calcular la suma total de los valores de los segmentos
  const totalValue = props.segments.reduce((acc, segment) => acc + segment.value, 0);

  // Si la suma total excede el valor máximo, normalizamos los valores para que sumen 1000
  if (totalValue > maxValue) {
    const scale = maxValue / totalValue;
    props.segments.forEach(segment => {
      segment.value = Math.floor(segment.value * scale);
    });
  }

  return {
    title: {
      text: 'RED',
      padding: 20,
      textStyle: {
        color: '#8C8C8C',
        fontWeight: 'bolder',
        fontSize: 16,
      },
    },
    series: [{
      type: 'gauge',
      max: 1000,  // Establecemos el máximo a 1000 para evitar que se sobrepase
      startAngle: 90,
      endAngle: -270,
      pointer: { show: false },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          borderWidth: 1,
          borderColor: '#464646',
        }
      },
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [1, '#2d3748']  // El color va hasta el 100% (1000 en este caso)
          ]
        }
      },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      title: {
        fontSize: 14,
        color: '#8C8C8C',
      },
      detail: {
        width: 65,
        height: 14,
        fontSize: 16,
        color: 'inherit',
        borderColor: 'inherit',
        borderRadius: 20,
        borderWidth: 1,
        formatter: '{value} Mbps',  // Ajuste para que muestre Mbps
      },
      data: props.segments.map((s, i) => {
        // Calcular posición para distribución uniforme
        const totalSegments = props.segments.length;
        const verticalOffset = totalSegments > 1 ? -40 + (i * 80 / (totalSegments - 1)) : 0;

        return {
          value: s.value,  // Ahora el valor puede estar dentro del rango de 0 a 1000
          name: s.name || `Segmento ${i + 1}`,
          title: {
            offsetCenter: ['0%', `${verticalOffset - 10}%`]
          },
          detail: {
            offsetCenter: ['0%', `${verticalOffset + 15}%`],
            color: '#ffffff'
          },
          itemStyle: {
            color: s.color ?? '#4caf50'
          }
        };
      })
    }]
  };
});
</script>

<style scoped>
.gauge-ring-chart {
  min-height: 260px;
  width: 100%;
}
</style>