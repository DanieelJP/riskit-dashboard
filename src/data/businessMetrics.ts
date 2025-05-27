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
      label: 'Ingresos Diarios',
      data: [15000, 18000, 16500, 22000, 25000, 28000, 24000],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)'
    }]
  },
  // ApexCharts - Barras
  betDistribution: {
    labels: ['Fútbol', 'Baloncesto', 'Tenis', 'Otros'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
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
  userMetrics: [
    { label: 'Nuevos Usuarios', value: 75 },
    { label: 'Usuarios Activos', value: 85 },
    { label: 'Retención', value: 65 },
    { label: 'Engagement', value: 80 }
  ],
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