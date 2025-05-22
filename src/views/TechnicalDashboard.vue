<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <h1>Dashboard Técnico</h1>
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
      <!-- KPIs Técnicos -->
      <div class="kpi-card" v-for="metric in technicalMetrics" :key="metric.id">
        <div class="kpi-header">
          <h3>{{ metric.name }}</h3>
          <span :class="['trend', metric.trend >= 0 ? 'positive' : 'negative']">
            {{ metric.trend >= 0 ? '+' : '' }}{{ metric.trend }}%
          </span>
        </div>
        <div class="kpi-value">{{ formatValue(metric.value, metric.unit) }}</div>
      </div>

      <!-- Gráficos -->
      <!-- 1. Gráfico de ApexCharts - Tiempo de Respuesta -->
      <div class="chart-card wide">
        <h3>Tiempo de Respuesta del Servidor</h3>
        <apexchart
          type="line"
          height="350"
          :options="serverResponseOptions"
          :series="serverResponseSeries"
        />
      </div>

      <!-- 2. Gráfico de Chart.js - Errores por Tipo -->
      <div class="chart-card">
        <h3>Errores por Tipo</h3>
        <canvas ref="errorTypeChart"></canvas>
      </div>

      <!-- 3. Gráfico de ECharts - Sesiones Concurrentes -->
      <div class="chart-card">
        <h3>Sesiones Concurrentes</h3>
        <v-chart class="chart" :option="concurrentSessionsOption" />
      </div>

      <!-- 4. Gráfico Propio - Distribución de Errores -->
      <div class="chart-card">
        <h3>Distribución de Errores</h3>
        <div class="custom-chart">
          <div v-for="(error, index) in errorDistribution" :key="index" class="error-bar">
            <div class="error-label">{{ error.label }}</div>
            <div class="error-bar-container">
              <div 
                class="error-bar-fill"
                :style="{ width: `${error.value}%`, backgroundColor: getColor(index) }"
              >
                <span class="error-value">{{ error.value }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Gráfico en Tiempo Real - Transacciones por Segundo -->
      <div class="chart-card wide">
        <h3>Transacciones por Segundo</h3>
        <canvas ref="realTimeTransactionsChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { technicalMetrics, technicalChartData } from '@/data/technicalMetrics';
import Chart from 'chart.js/auto';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

// Registrar componentes de ECharts
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent]);

// Referencias para los gráficos
const errorTypeChart = ref<HTMLCanvasElement | null>(null);
const realTimeTransactionsChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
let realTimeChartInstance: Chart | null = null;
let realTimeInterval: number | null = null;

// Datos para el gráfico en tiempo real
const realTimeData = ref({
  labels: [] as string[],
  values: [] as number[]
});

// Función para actualizar datos en tiempo real
const updateRealTimeData = () => {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const value = Math.floor(Math.random() * 50);

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

// Actualizar las opciones de los gráficos para el tema oscuro
const serverResponseOptions = {
  chart: {
    type: 'line',
    toolbar: { show: false },
    background: 'transparent'
  },
  colors: ['#7c4dff'],
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    strokeDashArray: 4
  },
  xaxis: {
    categories: technicalChartData.serverResponse.labels,
    labels: {
      style: {
        colors: '#ffffff'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Tiempo (ms)',
      style: {
        color: '#ffffff'
      }
    },
    labels: {
      style: {
        colors: '#ffffff'
      }
    }
  },
  theme: {
    mode: 'dark'
  }
};

const serverResponseSeries = [{
  name: 'Tiempo de respuesta',
  data: technicalChartData.serverResponse.datasets[0].data
}];

// Opciones para el gráfico de sesiones concurrentes (ECharts)
const concurrentSessionsOption = {
  xAxis: {
    type: 'category',
    data: technicalChartData.concurrentSessions.xAxis.data,
    axisLabel: {
      color: '#ffffff'
    }
  },
  yAxis: {
    type: 'value',
    name: 'Sesiones',
    axisLabel: {
      color: '#ffffff'
    }
  },
  series: [{
    type: 'line',
    areaStyle: {},
    data: technicalChartData.concurrentSessions.series[0].data,
    itemStyle: {
      color: '#7c4dff'
    }
  }]
};

// Datos para el gráfico personalizado
const errorDistribution = [
  { label: 'Pago', value: 35 },
  { label: 'Autenticación', value: 25 },
  { label: 'API', value: 20 },
  { label: 'Base de datos', value: 15 },
  { label: 'Otros', value: 5 }
];

const colors = ['#1a237e', '#0d47a1', '#2e7d32', '#f57c00', '#c62828'];
const getColor = (index: number) => colors[index % colors.length];

// Función para formatear valores
const formatValue = (value: number, unit: string) => {
  if (unit === 'ms') {
    return `${value}${unit}`;
  }
  return `${value}${unit}`;
};

// Inicializar gráficos
onMounted(() => {
  // Gráfico de errores por tipo (Chart.js)
  if (errorTypeChart.value) {
    chartInstance = new Chart(errorTypeChart.value, {
      type: 'bar',
      data: {
        labels: technicalChartData.transactionErrors.labels,
        datasets: [{
          label: 'Errores por tipo',
          data: technicalChartData.transactionErrors.datasets[0].data,
          backgroundColor: '#7c4dff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            backgroundColor: '#1e1e1e',
            borderColor: '#333333',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff',
              font: {
                size: 12
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff',
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  // Gráfico en tiempo real (Chart.js)
  if (realTimeTransactionsChart.value) {
    // Inicializar con algunos datos
    for (let i = 0; i < 10; i++) {
      const now = new Date();
      now.setSeconds(now.getSeconds() - (10 - i));
      realTimeData.value.labels.push(now.toLocaleTimeString());
      realTimeData.value.values.push(Math.floor(Math.random() * 50));
    }

    realTimeChartInstance = new Chart(realTimeTransactionsChart.value, {
      type: 'line',
      data: {
        labels: [...realTimeData.value.labels],
        datasets: [{
          label: 'Transacciones/segundo',
          data: [...realTimeData.value.values],
          borderColor: '#7c4dff',
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
            suggestedMax: 50,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              stepSize: 10,
              color: '#ffffff'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              color: '#ffffff'
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
    realTimeInterval = window.setInterval(updateRealTimeData, 1000);
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
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-range:hover {
  background-color: var(--card-color);
  color: var(--text-primary);
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

.error-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.error-bar-container {
  height: 24px;
  background-color: var(--surface-color);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.error-bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: width 0.5s ease-in-out;
}

.error-value {
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