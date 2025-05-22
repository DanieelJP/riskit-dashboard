export interface TechnicalMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: number;
  status: 'success' | 'warning' | 'danger';
}

export const technicalMetrics: TechnicalMetric[] = [
  {
    id: 'server-response',
    name: 'Tiempo de respuesta del servidor',
    value: 245,
    unit: 'ms',
    trend: -12,
    status: 'success'
  },
  {
    id: 'transaction-errors',
    name: 'Tasa de errores en transacciones',
    value: 0.8,
    unit: '%',
    trend: -0.2,
    status: 'success'
  },
  {
    id: 'app-load-time',
    name: 'Tiempo de carga de la aplicación',
    value: 1.8,
    unit: 's',
    trend: -0.3,
    status: 'success'
  },
  {
    id: 'payment-success',
    name: 'Tasa de éxito en pagos',
    value: 99.2,
    unit: '%',
    trend: 0.5,
    status: 'success'
  },
  {
    id: 'concurrent-sessions',
    name: 'Sesiones concurrentes',
    value: 1250,
    unit: ' usuarios',
    trend: 150,
    status: 'warning'
  }
];

// Datos para gráficos
export const technicalChartData = {
  // Chart.js - Líneas
  serverResponse: {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
      label: 'Tiempo de respuesta (ms)',
      data: [245, 238, 252, 245, 240, 235],
      borderColor: '#1a237e',
      tension: 0.4
    }]
  },
  // ApexCharts - Barras
  transactionErrors: {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    datasets: [{
      label: 'Errores por tipo',
      data: [12, 8, 15, 10, 7, 5, 9],
      backgroundColor: ['#1a237e', '#0d47a1', '#2e7d32', '#f57c00', '#c62828']
    }]
  },
  // ECharts - Área
  concurrentSessions: {
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    },
    series: [{
      name: 'Sesiones',
      type: 'line',
      areaStyle: {},
      data: [800, 1200, 1500, 1800, 1600, 1400]
    }]
  },
  // Custom - Distribución de errores
  errorDistribution: {
    labels: ['Pago', 'Autenticación', 'API', 'Base de datos', 'Otros'],
    values: [35, 25, 20, 15, 5]
  },
  // Tiempo real - Transacciones
  realTimeTransactions: {
    labels: [],
    datasets: [{
      label: 'Transacciones/segundo',
      data: [],
      borderColor: '#1a237e',
      tension: 0.4
    }]
  }
}; 