<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <h1>Dashboard de Negocio</h1>
        <div class="header-actions">
          <router-link to="/kpis" class="action-button">
            <span class="icon">📈</span>
            Ver KPIs
          </router-link>
        </div>
      </div>
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
    toolbar: { show: false },
    background: 'transparent'
  },
  colors: ['#7c4dff'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    borderColor: 'var(--chart-grid-color)',
    strokeDashArray: 4
  },
  xaxis: {
    categories: businessChartData.dailyRevenue.labels,
    labels: {
      style: {
        colors: 'var(--chart-text-color)'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: 'var(--chart-text-color)'
      },
      formatter: (value: number) => `€${value.toLocaleString()}`
    }
  },
  theme: {
    mode: 'dark'
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
          backgroundColor: ['#7c4dff', '#1a237e', '#0d47a1', '#2e7d32', '#f57c00']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#ffffff',
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            backgroundColor: '#1e1e1e',
            borderColor: '#333333',
            borderWidth: 1
          }
        }
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
  background-color: var(--background-color);
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  text-decoration: none;
}

.action-button:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-1px);
}

.dashboard-header h1 {
  font-size: 28px;
  color: var(--text-primary);
  margin: 0;
  font-weight: 600;
}

.date-range {
  color: var(--text-secondary);
  font-size: 14px;
  background-color: var(--surface-color);
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
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
  background: var(--card-color);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.kpi-header h3 {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.trend {
  font-size: 14px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 20px;
}

.trend.positive {
  background-color: rgba(0, 230, 118, 0.1);
  color: var(--success-color);
}

.trend.negative {
  background-color: rgba(255, 23, 68, 0.1);
  color: var(--danger-color);
}

.kpi-value {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-card {
  background: var(--card-color);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  grid-column: span 1;
  height: 400px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.chart-card canvas {
  max-height: 300px;
  width: 100% !important;
  height: 100% !important;
}

.chart-card.wide {
  grid-column: span 3;
  height: 400px;
}

.chart-card h3 {
  font-size: 18px;
  color: var(--text-primary);
  margin: 0 0 20px 0;
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
  gap: 20px;
  overflow-y: auto;
  padding-right: 8px;
}

.metric-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.metric-bar-container {
  height: 24px;
  background-color: var(--surface-color);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.metric-bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: width 0.5s ease-in-out;
}

.metric-value {
  color: var(--text-primary);
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

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style> 