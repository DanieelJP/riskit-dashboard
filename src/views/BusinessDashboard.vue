<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard de Negocio</h1>
      <div class="date-range">
        <span>Últimos 30 días</span>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- KPIs Principales -->
      <div class="kpi-card" v-for="metric in businessMetrics" :key="metric.id">
        <div class="kpi-header">
          <h3>{{ metric.name }}</h3>
          <span :class="['trend', metric.trend >= 0 ? 'positive' : 'negative']">
            {{ metric.trend >= 0 ? '+' : '' }}{{ metric.trend }}%
          </span>
        </div>
        <div class="kpi-value">{{ formatValue(metric.value, metric.unit) }}</div>
      </div>

      <!-- Gráficos -->
      <!-- 1. Gráfico de ApexCharts - Ingresos Diarios -->
      <div class="chart-card wide">
        <h3>Ingresos Diarios</h3>
        <apexchart
          type="area"
          height="350"
          :options="dailyRevenueOptions"
          :series="dailyRevenueSeries"
        />
      </div>

      <!-- 2. Gráfico de Chart.js - Distribución de Apuestas -->
      <div class="chart-card">
        <h3>Distribución de Apuestas</h3>
        <canvas ref="betDistributionChart"></canvas>
      </div>

      <!-- 3. Gráfico de ECharts - Correlación de Apuestas -->
      <div class="chart-card">
        <h3>Correlación de Apuestas</h3>
        <v-chart class="chart" :option="betCorrelationOption" />
      </div>

      <!-- 4. Gráfico Propio - Métricas de Usuario -->
      <div class="chart-card">
        <h3>Métricas de Usuario</h3>
        <div class="custom-chart">
          <div v-for="(metric, index) in userMetrics" :key="index" class="metric-bar">
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-bar-container">
              <div 
                class="metric-bar-fill"
                :style="{ width: `${metric.value}%`, backgroundColor: getColor(index) }"
              >
                <span class="metric-value">{{ metric.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Gráfico en Tiempo Real - Apuestas Activas -->
      <div class="chart-card wide">
        <h3>Apuestas Activas en Tiempo Real</h3>
        <canvas ref="realTimeChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { businessMetrics, businessChartData } from '@/data/businessMetrics';
import Chart from 'chart.js/auto';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

// Registrar componentes de ECharts
use([CanvasRenderer, ScatterChart, GridComponent, TooltipComponent, LegendComponent]);

// Referencias para los gráficos
const betDistributionChart = ref<HTMLCanvasElement | null>(null);
const realTimeChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
let realTimeChartInstance: Chart | null = null;
let realTimeInterval: number | null = null;

// Datos para el gráfico en tiempo real
const realTimeData = ref({
  labels: [] as string[],
  values: [] as number[]
});

// Opciones para el gráfico de ingresos diarios (ApexCharts)
const dailyRevenueOptions = {
  chart: {
    type: 'area',
    toolbar: { show: false }
  },
  colors: ['#1a237e'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  xaxis: {
    categories: businessChartData.dailyRevenue.labels
  },
  yaxis: {
    labels: {
      formatter: (value: number) => `€${value.toLocaleString()}`
    }
  }
};

const dailyRevenueSeries = [{
  name: 'Ingresos',
  data: businessChartData.dailyRevenue.datasets[0].data
}];

// Opciones para el gráfico de correlación (ECharts)
const betCorrelationOption = {
  xAxis: {
    type: 'value',
    name: 'Valor de apuesta (€)'
  },
  yAxis: {
    type: 'value',
    name: 'Ganancia (€)'
  },
  series: [{
    type: 'scatter',
    data: businessChartData.betCorrelation.series[0].data,
    symbolSize: 10,
    itemStyle: {
      color: '#1a237e'
    }
  }]
};

// Datos para el gráfico personalizado
const userMetrics = [
  { label: 'Nuevos', value: 25 },
  { label: 'Activos', value: 60 },
  { label: 'Inactivos', value: 15 }
];

const colors = ['#1a237e', '#0d47a1', '#2e7d32', '#f57c00', '#c62828'];
const getColor = (index: number) => colors[index % colors.length];

// Función para formatear valores
const formatValue = (value: number, unit: string) => {
  if (unit === '€') {
    return `${value.toLocaleString()}${unit}`;
  }
  return `${value}${unit}`;
};

// Función para actualizar datos en tiempo real
const updateRealTimeData = () => {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const value = Math.floor(Math.random() * 100);

  realTimeData.value.labels.push(time);
  realTimeData.value.values.push(value);

  // Mantener solo los últimos 10 puntos
  if (realTimeData.value.labels.length > 10) {
    realTimeData.value.labels.shift();
    realTimeData.value.values.shift();
  }

  // Actualizar el gráfico si existe
  if (realTimeChartInstance) {
    realTimeChartInstance.data.labels = [...realTimeData.value.labels];
    realTimeChartInstance.data.datasets[0].data = [...realTimeData.value.values];
    realTimeChartInstance.update('none');
  }
};

// Inicializar gráficos
onMounted(() => {
  // Gráfico de distribución de apuestas (Chart.js)
  if (betDistributionChart.value) {
    chartInstance = new Chart(betDistributionChart.value, {
      type: 'doughnut',
      data: {
        labels: businessChartData.betDistribution.labels,
        datasets: [{
          data: businessChartData.betDistribution.datasets[0].data,
          backgroundColor: businessChartData.betDistribution.datasets[0].backgroundColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Gráfico en tiempo real (Chart.js)
  if (realTimeChart.value) {
    // Inicializar con algunos datos
    for (let i = 0; i < 10; i++) {
      const now = new Date();
      now.setSeconds(now.getSeconds() - (10 - i) * 2);
      realTimeData.value.labels.push(now.toLocaleTimeString());
      realTimeData.value.values.push(Math.floor(Math.random() * 100));
    }

    realTimeChartInstance = new Chart(realTimeChart.value, {
      type: 'line',
      data: {
        labels: [...realTimeData.value.labels],
        datasets: [{
          label: 'Apuestas activas',
          data: [...realTimeData.value.values],
          borderColor: '#1a237e',
          tension: 0.4,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            ticks: {
              stepSize: 20
            }
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    // Iniciar actualizaciones en tiempo real
    realTimeInterval = window.setInterval(updateRealTimeData, 2000);
  }
});

// Limpiar gráficos al desmontar
onUnmounted(() => {
  if (realTimeInterval) {
    clearInterval(realTimeInterval);
    realTimeInterval = null;
  }
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  if (realTimeChartInstance) {
    realTimeChartInstance.destroy();
    realTimeChartInstance = null;
  }
  // Limpiar datos
  realTimeData.value.labels = [];
  realTimeData.value.values = [];
});
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 24px;
  color: #1a237e;
  margin: 0;
}

.date-range {
  color: #666;
  font-size: 14px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  grid-column: span 1;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-header h3 {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.trend {
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
}

.trend.positive {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.trend.negative {
  background-color: #ffebee;
  color: #c62828;
}

.kpi-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a237e;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  grid-column: span 1;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-card.wide {
  grid-column: span 3;
  height: 400px;
}

.chart-card h3 {
  font-size: 16px;
  color: #666;
  margin: 0 0 16px 0;
  flex-shrink: 0;
}

.chart {
  flex: 1;
  min-height: 0;
}

.custom-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.metric-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  font-size: 14px;
  color: #666;
}

.metric-bar-container {
  height: 24px;
  background-color: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: width 0.5s ease-in-out;
}

.metric-value {
  color: white;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 1400px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-card.wide {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    padding: 0 16px;
  }
  
  .chart-card.wide {
    grid-column: span 1;
  }
}
</style> 