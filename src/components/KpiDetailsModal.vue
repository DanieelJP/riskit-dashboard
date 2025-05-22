<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ kpi.name }}</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div class="kpi-info">
          <div class="info-section">
            <h3>Descripción</h3>
            <p>{{ kpi.description }}</p>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <h4>Valor Actual</h4>
              <div class="metric-value">{{ formatValue(kpi.value, kpi.unit) }}</div>
            </div>
            
            <div class="metric-card">
              <h4>Objetivo</h4>
              <div class="metric-value">{{ formatValue(kpi.target, kpi.unit) }}</div>
            </div>
            
            <div class="metric-card">
              <h4>Tendencia</h4>
              <div class="metric-value" :class="kpi.trend >= 0 ? 'positive' : 'negative'">
                {{ kpi.trend >= 0 ? '+' : '' }}{{ kpi.trend }}%
              </div>
            </div>
            
            <div class="metric-card">
              <h4>Estado</h4>
              <div class="metric-value" :class="getStatusClass(kpi)">
                {{ getStatusText(kpi) }}
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Histórico</h3>
            <div class="chart-container">
              <canvas ref="historyChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps<{
  show: boolean;
  kpi: any;
}>();

const emit = defineEmits(['close']);

const historyChart = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const closeModal = () => {
  emit('close');
};

const formatValue = (value: number, unit: string) => {
  if (unit === '€') {
    return `${value.toLocaleString()}${unit}`;
  }
  if (unit === '%') {
    return `${value.toFixed(1)}${unit}`;
  }
  return `${value}${unit}`;
};

const getStatusClass = (kpi: any) => {
  switch (kpi.status) {
    case 'on-track':
      return 'status-success';
    case 'at-risk':
      return 'status-warning';
    case 'off-track':
      return 'status-danger';
    default:
      return '';
  }
};

const getStatusText = (kpi: any) => {
  switch (kpi.status) {
    case 'on-track':
      return 'En Objetivo';
    case 'at-risk':
      return 'En Riesgo';
    case 'off-track':
      return 'Fuera de Objetivo';
    default:
      return '';
  }
};

// Generar datos de ejemplo para el histórico
const generateHistoricalData = () => {
  const data = [];
  const labels = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString());
    
    // Generar un valor aleatorio alrededor del valor actual
    const randomValue = props.kpi.value * (1 + (Math.random() - 0.5) * 0.2);
    data.push(randomValue);
  }
  
  return { labels, data };
};

onMounted(() => {
  if (historyChart.value) {
    const { labels, data } = generateHistoricalData();
    
    chartInstance = new Chart(historyChart.value, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: props.kpi.name,
          data,
          borderColor: '#1a237e',
          tension: 0.4,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'var(--text-secondary)'
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'var(--text-secondary)',
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
  }
});

watch(() => props.show, (newValue) => {
  if (!newValue && chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--card-color);
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 24px;
}

.close-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: var(--surface-color);
  color: var(--text-primary);
}

.modal-body {
  padding: 20px;
}

.kpi-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-section {
  background-color: var(--surface-color);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
}

.info-section h3 {
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-size: 18px;
}

.info-section p {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  background-color: var(--surface-color);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
}

.metric-card h4 {
  color: var(--text-secondary);
  margin: 0 0 8px 0;
  font-size: 14px;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.metric-value.positive {
  color: var(--success-color);
}

.metric-value.negative {
  color: var(--danger-color);
}

.chart-container {
  height: 300px;
  position: relative;
}

.status-success {
  color: var(--success-color);
}

.status-warning {
  color: var(--warning-color);
}

.status-danger {
  color: var(--danger-color);
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 