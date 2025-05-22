export interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: number;
  status: 'success' | 'warning' | 'danger';
}

export const businessMetrics: BusinessMetric[] = [
  {
    id: 'total-revenue',
    name: 'Ingresos totales por apuestas',
    value: 125000,
    unit: '€',
    trend: 8.5,
    status: 'success'
  },
  {
    id: 'conversion-rate',
    name: 'Tasa de conversión de usuarios',
    value: 3.2,
    unit: '%',
    trend: 0.5,
    status: 'success'
  },
  {
    id: 'avg-bet',
    name: 'Valor promedio de apuesta',
    value: 45,
    unit: '€',
    trend: 5,
    status: 'success'
  },
  {
    id: 'user-retention',
    name: 'Retención de usuarios',
    value: 78,
    unit: '%',
    trend: 2,
    status: 'success'
  },
  {
    id: 'profit-ratio',
    name: 'Ratio de ganancias/pérdidas',
    value: 1.8,
    unit: 'x',
    trend: 0.2,
    status: 'warning'
  }
];

// Datos para gráficos
export const businessChartData = {
  // Chart.js - Líneas
  dailyRevenue: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Ingresos diarios (€)',
      data: [15000, 18000, 16500, 19000, 22000, 25000, 23000],
      borderColor: '#1a237e',
      backgroundColor: 'rgba(26, 35, 126, 0.1)',
      fill: true
    }]
  },
  // ApexCharts - Barras
  betDistribution: {
    labels: ['Deportes', 'Casino', 'Poker', 'Apuestas en vivo', 'Otros'],
    datasets: [{
      label: 'Distribución de apuestas',
      data: [45, 25, 15, 10, 5],
      backgroundColor: ['#1a237e', '#0d47a1', '#2e7d32', '#f57c00', '#c62828']
    }]
  },
  // ECharts - Dispersión
  betCorrelation: {
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
      data: [
        [10, 20], [20, 35], [30, 45], [40, 60], [50, 75],
        [60, 90], [70, 110], [80, 130], [90, 150], [100, 180]
      ]
    }]
  },
  // Custom - Métricas de usuario
  userMetrics: {
    labels: ['Nuevos', 'Activos', 'Inactivos', 'Premium', 'VIP'],
    values: [1200, 8500, 2300, 1500, 800]
  },
  // Tiempo real - Apuestas activas
  realTimeBets: {
    labels: [],
    datasets: [{
      label: 'Apuestas activas',
      data: [],
      borderColor: '#1a237e',
      tension: 0.4
    }]
  }
}; 