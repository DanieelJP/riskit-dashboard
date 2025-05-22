<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard de Apuestas</h1>
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

      <!-- Gráficos Detallados -->
      <div class="chart-card wide">
        <h3>Ingresos Diarios</h3>
        <apexchart
          type="area"
          height="350"
          :options="dailyRevenueOptions"
          :series="dailyRevenueSeries"
        />
      </div>

      <div class="chart-card">
        <h3>Distribución de Apuestas</h3>
        <apexchart
          type="donut"
          height="350"
          :options="betDistributionOptions"
          :series="betDistributionSeries"
        />
      </div>

      <div class="chart-card">
        <h3>Correlación de Apuestas</h3>
        <apexchart
          type="scatter"
          height="350"
          :options="betCorrelationOptions"
          :series="betCorrelationSeries"
        />
      </div>

      <div class="chart-card">
        <h3>Métricas de Usuario</h3>
        <apexchart
          type="bar"
          height="350"
          :options="userMetricsOptions"
          :series="userMetricsSeries"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { businessMetrics, businessChartData } from '@/data/businessMetrics';
import VueApexCharts from 'vue3-apexcharts';

// Opciones para el gráfico de ingresos diarios
const dailyRevenueOptions = {
  chart: {
    type: 'area',
    toolbar: {
      show: false
    }
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
  dataLabels: {
    enabled: false
  },
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

// Opciones para el gráfico de distribución de apuestas
const betDistributionOptions = {
  chart: {
    type: 'donut'
  },
  colors: businessChartData.betDistribution.datasets[0].backgroundColor,
  labels: businessChartData.betDistribution.labels,
  legend: {
    position: 'bottom'
  }
};

const betDistributionSeries = businessChartData.betDistribution.datasets[0].data;

// Opciones para el gráfico de correlación de apuestas
const betCorrelationOptions = {
  chart: {
    type: 'scatter',
    toolbar: {
      show: false
    }
  },
  colors: ['#1a237e'],
  xaxis: {
    title: {
      text: 'Valor de apuesta (€)'
    }
  },
  yaxis: {
    title: {
      text: 'Ganancia (€)'
    }
  }
};

const betCorrelationSeries = [{
  name: 'Apuestas',
  data: businessChartData.betCorrelation.series[0].data
}];

// Opciones para el gráfico de métricas de usuario
const userMetricsOptions = {
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    }
  },
  colors: ['#1a237e'],
  xaxis: {
    categories: businessChartData.userMetrics.labels
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false
    }
  }
};

const userMetricsSeries = [{
  name: 'Usuarios',
  data: businessChartData.userMetrics.values
}];

// Función para formatear valores
const formatValue = (value: number, unit: string) => {
  if (unit === '€') {
    return `${value.toLocaleString()}${unit}`;
  }
  return `${value}${unit}`;
};
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
}

.chart-card.wide {
  grid-column: span 2;
}

.chart-card h3 {
  font-size: 16px;
  color: #666;
  margin: 0 0 16px 0;
}

@media (max-width: 1200px) {
  .chart-card.wide {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style> 