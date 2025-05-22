<template>
    <div class="streaming-chart">
        <div class="kpi-box" v-if="currentKPI !== null">  
            <span class="kpi-label">Actual: </span>
            <span class="kpi-value">{{ currentKPI }}%</span>
            <span class="kpi-target" v-if="props.kpiTarget">/ Objetivo: {{ props.kpiTarget }} - {{ props.kpiTargetMax }}%</span>
        </div>
        <canvas ref="canvasRef"></canvas>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Filler } from 'chart.js';
import streamingPlugin from 'chartjs-plugin-streaming';
import 'chartjs-adapter-date-fns';

// Definir props
const props = withDefaults(defineProps<{
    chartType?: 'line' | 'area';
    title?: string;
    color?: string;
    min?: number;
    max?: number;
    kpiTarget?: number;
    kpiTargetMax?: number;
}>(), {
    chartType: 'line',
    title: 'Carga del servidor',
    color: '#10b981',
    min: 0,
    max: 100,
});


const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const currentKPI = ref<number | null>(null);

onMounted(() => {
    if (!canvasRef.value) return;


    // Configurar según el tipo de gráfico
    const isArea = props.chartType === 'area';

    // Registrar plugins necesarios
    Chart.register(
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        TimeScale,
        Title,
        Tooltip,
        streamingPlugin
    );

    // Registrar Filler solo si es necesario
    if (isArea) {
        Chart.register(Filler);
    }


    chartInstance = new Chart(canvasRef.value, {
        type: 'line',
        data: {
            datasets: [{
                label: props.title,
                borderColor: props.color,
                backgroundColor: isArea ? `${props.color}40` : 'transparent', // 40 = 25% opacidad en hex
                borderWidth: 2,
                fill: isArea,
                tension: 0.3,
                data: []
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite que el gráfico ocupe todo el espacio disponible
            devicePixelRatio: window.devicePixelRatio || 2, // Optimizado para la pantalla del dispositivo
            animation: false, // Desactivado para mejor rendimiento en tiempo real

            scales: {
                x: {
                    type: 'realtime',
                    realtime: {
                        duration: 20000,      // Mostrar últimos 20s
                        refresh: 1000,        // Nuevo punto cada 1s
                        delay: 1000,          // Retraso para sincronización visual
                        onRefresh(chart) {
                            const newY = Math.floor(Math.random() * (Math.min(props.max, 100) - props.min) + props.min);
                            chart.data.datasets[0].data.push({
                                x: Date.now(),
                                y: Math.floor(Math.random() * (Math.min(props.max, 100) - props.min) + props.min),
                            });
                            currentKPI.value = newY;
                        }
                    },
                    grid: {
                        color: 'rgba(203, 213, 225, 0.1)' // Grid más sutil
                    },
                    ticks: {
                        color: '#8C8C8C',
                        maxRotation: 0 // Evita rotación de etiquetas para mejor legibilidad
                    }
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(203, 213, 225, 0.1)' // Grid más sutil
                    },
                    ticks: {
                        color: '#8C8C8C',
                        stepSize: 20 // Intervalos más limpios
                    },
                    title: {
                        display: false,
                        text: 'Carga (%)',
                        color: '#8C8C8C',
                        font: {
                            size: 12
                        }
                    }
                }
            },

            plugins: {
                legend: {
                    labels: {
                        color: '#e2e8f0',
                        usePointStyle: true // Usa el estilo de punto para la leyenda
                    }
                },
                title: {
                    display: true,
                    text: props.title,
                    color: '#8C8C8C',
                    align: 'start',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20,
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'nearest',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    titleColor: '#8C8C8C',
                    bodyColor: '#8C8C8C',
                    padding: 10,
                    displayColors: false, // Simplifica el tooltip
                    callbacks: {
                        label: function (context) {
                            return `Carga: ${context.parsed.y}%`;
                        }
                    }
                }
            },

            elements: {
                point: {
                    radius: 0,         // Oculta puntos para una línea más limpia
                    hoverRadius: 6,    // Muestra puntos al pasar el mouse
                    hitRadius: 10,     // Área invisible más grande para mejor interacción
                    borderWidth: 2
                },
                line: {
                    borderWidth: 2,
                    borderJoinStyle: 'round' // Líneas más suaves
                }
            }
        }
    });
});


onBeforeUnmount(() => {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null; // Liberar memoria
    }
});
</script>


<style scoped>
.streaming-chart {
    width: 100%;
    height: 90%;
    padding: 8px 15px;
}
.kpi-box {
  text-align: center;
  /* margin-bottom: 0.5rem; */
  font-size: 0.9rem;
  color: #f0f0f0;
}

.kpi-box span {
  display: inline;
}

.kpi-value {
  /* font-size: 1.1rem; */
  font-weight: bold;
  margin: 0 4px;
}

.kpi-label, .kpi-target {
  font-size: 0.85rem;
  color: #8C8C8C;
}
</style>