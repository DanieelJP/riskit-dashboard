<template>
  <div class="kpi-list">
    <div class="kpi-list-header">
      <div class="header-content">
        <h1>Lista de KPIs</h1>
        <div class="header-actions">
          <button class="action-button" @click="showAddKpiModal">
            <span class="icon">➕</span>
            Añadir KPI
          </button>
        </div>
      </div>
      <div class="kpi-filters">
        <div class="date-range">
          <span>Últimos 30 días</span>
        </div>
        <div class="filter-buttons">
          <button 
            v-for="category in categories" 
            :key="category"
            :class="['filter-button', { active: selectedCategory === category }]"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <div class="kpi-table-container">
      <table class="kpi-table">
        <thead>
          <tr>
            <th>KPI</th>
            <th>Valor Actual</th>
            <th>Tendencia</th>
            <th>Objetivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="kpi in filteredKpis" :key="kpi.id">
            <td>
              <div class="kpi-name">
                <h3>{{ kpi.name }}</h3>
                <p>{{ kpi.description }}</p>
              </div>
            </td>
            <td>
              <div class="kpi-value">
                {{ formatValue(kpi.value, kpi.unit) }}
              </div>
            </td>
            <td>
              <div class="kpi-trend" :class="kpi.trend >= 0 ? 'positive' : 'negative'">
                {{ kpi.trend >= 0 ? '+' : '' }}{{ kpi.trend }}%
              </div>
            </td>
            <td>
              <div class="kpi-target">
                {{ formatValue(kpi.target, kpi.unit) }}
              </div>
            </td>
            <td>
              <div class="kpi-status" :class="getStatusClass(kpi)">
                {{ getStatusText(kpi) }}
              </div>
            </td>
            <td>
              <div class="kpi-actions">
                <button class="action-button" @click="showKpiDetails(kpi)">
                  <span class="icon">📊</span>
                  Detalles
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Detalles -->
    <KpiDetailsModal
      :show="showDetailsModal"
      :kpi="selectedKpi"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import KpiDetailsModal from '@/components/KpiDetailsModal.vue';

// Categorías de KPIs
const categories = ['Todos', 'Negocio', 'Técnico', 'Usuario'];
const selectedCategory = ref('Todos');

// Datos de ejemplo - En un caso real, esto vendría de una API
const kpis = [
  {
    id: 1,
    name: 'Ingresos Totales',
    description: 'Ingresos generados por apuestas',
    value: 150000,
    unit: '€',
    trend: 12.5,
    target: 200000,
    category: 'Negocio',
    status: 'on-track'
  },
  {
    id: 2,
    name: 'Usuarios Activos',
    description: 'Número de usuarios que realizan apuestas',
    value: 2500,
    unit: '',
    trend: 8.3,
    target: 3000,
    category: 'Usuario',
    status: 'at-risk'
  },
  {
    id: 3,
    name: 'Tiempo de Respuesta',
    description: 'Tiempo promedio de respuesta del servidor',
    value: 150,
    unit: 'ms',
    trend: -5.2,
    target: 100,
    category: 'Técnico',
    status: 'off-track'
  },
  {
    id: 4,
    name: 'Tasa de Conversión',
    description: 'Porcentaje de visitantes que realizan apuestas',
    value: 3.5,
    unit: '%',
    trend: 2.1,
    target: 4.0,
    category: 'Negocio',
    status: 'on-track'
  },
  {
    id: 5,
    name: 'Uptime del Sistema',
    description: 'Tiempo de actividad del sistema',
    value: 99.9,
    unit: '%',
    trend: 0.1,
    target: 99.95,
    category: 'Técnico',
    status: 'on-track'
  }
];

// Filtrar KPIs según la categoría seleccionada
const filteredKpis = computed(() => {
  if (selectedCategory.value === 'Todos') {
    return kpis;
  }
  return kpis.filter(kpi => kpi.category === selectedCategory.value);
});

// Función para formatear valores
const formatValue = (value: number, unit: string) => {
  if (unit === '€') {
    return `${value.toLocaleString()}${unit}`;
  }
  if (unit === '%') {
    return `${value.toFixed(1)}${unit}`;
  }
  return `${value}${unit}`;
};

// Función para obtener la clase de estado
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

// Función para obtener el texto de estado
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

// Estado del modal
const showDetailsModal = ref(false);
const selectedKpi = ref(null);

// Función para mostrar detalles del KPI
const showKpiDetails = (kpi: any) => {
  selectedKpi.value = kpi;
  showDetailsModal.value = true;
};

// Función para cerrar el modal
const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedKpi.value = null;
};

// Función para mostrar modal de añadir KPI
const showAddKpiModal = () => {
  // Implementar lógica para añadir KPI
  console.log('Añadir nuevo KPI');
};
</script>

<style scoped>
.kpi-list {
  padding: 24px;
  background-color: var(--background-color);
  min-height: 100vh;
}

.kpi-list-header {
  margin-bottom: 32px;
  padding: 0 24px;
}

.kpi-list-header h1 {
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.kpi-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.date-range {
  color: var(--text-secondary);
  font-size: 14px;
  background-color: var(--surface-color);
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

.filter-button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--surface-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-button:hover {
  background-color: var(--card-color);
  color: var(--text-primary);
}

.filter-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.kpi-table-container {
  background-color: var(--card-color);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.kpi-table {
  width: 100%;
  border-collapse: collapse;
}

.kpi-table th,
.kpi-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.kpi-table th {
  background-color: var(--surface-color);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 14px;
}

.kpi-table tbody tr:hover {
  background-color: var(--surface-color);
}

.kpi-name h3 {
  color: var(--text-primary);
  margin: 0 0 4px 0;
  font-size: 16px;
}

.kpi-name p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
}

.kpi-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.kpi-trend {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
}

.kpi-trend.positive {
  background-color: rgba(0, 230, 118, 0.1);
  color: var(--success-color);
}

.kpi-trend.negative {
  background-color: rgba(255, 23, 68, 0.1);
  color: var(--danger-color);
}

.kpi-target {
  color: var(--text-secondary);
  font-size: 14px;
}

.kpi-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
}

.status-success {
  background-color: rgba(0, 230, 118, 0.1);
  color: var(--success-color);
}

.status-warning {
  background-color: rgba(255, 214, 0, 0.1);
  color: var(--warning-color);
}

.status-danger {
  background-color: rgba(255, 23, 68, 0.1);
  color: var(--danger-color);
}

.kpi-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: var(--surface-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.icon {
  font-size: 16px;
}

@media (max-width: 1200px) {
  .kpi-table {
    display: block;
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .kpi-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .filter-button {
    white-space: nowrap;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
}

.action-button:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-1px);
}
</style> 