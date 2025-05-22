<template>
  <VEChart
    :option="mapOptions"
    autoresize
    style="height: 600px; width: 100%;"
  />
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'

// Echarts
import VEChart from 'vue-echarts'
import * as echarts from 'echarts/core'
import { MapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import {
  TooltipComponent,
  VisualMapComponent,
  TitleComponent,
  ToolboxComponent
} from 'echarts/components'

// GeoMap
//import europeMap from '@/assets/europe.geo.json'
import globalMap from '@/assets/global.geo.json'

// Registrar módulos necesarios de ECharts
echarts.use([
  MapChart,
  CanvasRenderer,
  TooltipComponent,
  VisualMapComponent,
  TitleComponent,
  ToolboxComponent
])

// Registrar el mapa de Europa en ECharts con ajuste para Islandia
onMounted(() => {
  echarts.registerMap('global', globalMap as any, {
    Iceland: {
      left: -20,
      top: 65,
      width: 12
    }
  })
})

// Props
const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    data: { name: string; value: number }[]
  }>(),
  {
    title: 'Título del gráfico',
    subtitle: 'Subtítulo',
    data: () => []
  }
)

// Configuración del gráfico
const mapOptions = ref({})

watchEffect(() => {
  const values = props.data.map(d => d.value)
  const minVal = Math.min(...values, 0)
  const maxVal = Math.max(...values, 1)

  mapOptions.value = {
    title: {
      text: props.title,
      subtext: props.subtitle,
      left: 'left',
      textStyle: {
        color: '#8C8C8C',
        fontSize: 16,
        fontWeight: 'bold'
      },
      subtextStyle: {
        color: '#8C8C8C'
      }
    },
    toolbox: {
      show: true,
      left: 'right',
      top: 'top',
      feature: {
        dataView: {
          readOnly: false,
          backgroundColor: '#1E1E1E',
          textareaColor: '#1E1E1E',
          textColor: '#8C8C8C',
          buttonColor: '#071c49',
          lang: ['Datos', 'Cerrar', 'Actualizar']
        },
        restore: {},
        saveAsImage: {}
      }
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      min: minVal,
      max: maxVal,
      left: 'left',
      top: 'bottom',
      text: ['Más', 'Menos'],
      textStyle: { color: '#B9B8CE' },
      calculable: true,
      inRange: { color: ['#e0f3f8', '#74add1', '#4575b4'] },
      outOfRange: {
        color: ['rgba(200, 200, 200, 0.2)']
      }
    },
    series: [
      {
        name: 'Descargas',
        type: 'map',
        map: 'global',
        roam: true,
        emphasis: {
          label: { show: true },
          itemStyle: {
            areaColor: '#74add1',
            borderWidth: 1
          }
        },
        itemStyle: {
          areaColor: 'rgba(128, 128, 128, 0.5)',
          borderColor: 'rgba(255, 255, 255, 0.5)',
          borderWidth: 0.5
        },
        data: props.data
      }
    ]
  }
})
</script>

<style scoped>
</style>
