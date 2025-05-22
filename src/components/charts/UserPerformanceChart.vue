<template>
  <div class="user-performance">
    <div class="chart-container">
      <div class="performance-metrics">
        <div class="metric" v-for="(metric, index) in data.metrics" :key="index">
          <div class="metric-header">
            <div class="metric-label">{{ metric.label }}</div>
            <div class="metric-value">{{ metric.value }}</div>
          </div>
          <div class="metric-chart">
            <div 
              v-for="(point, pointIndex) in metric.points" 
              :key="pointIndex"
              class="metric-point"
              :style="{
                left: `${(pointIndex / (metric.points.length - 1)) * 100}%`,
                bottom: `${point}%`,
                backgroundColor: getColor(index)
              }"
            >
              <div class="metric-tooltip">
                {{ point }}%
              </div>
            </div>
            <svg class="metric-line-svg">
              <polyline
                :points="getPoints(metric.points)"
                :style="{ stroke: getColor(index) }"
                fill="none"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="performance-summary">
        <div class="summary-item" v-for="(summary, index) in data.summary" :key="index">
          <div class="summary-label">{{ summary.label }}</div>
          <div class="summary-value">{{ summary.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    metrics: Array<{
      label: string;
      value: string;
      points: number[];
    }>;
    summary: Array<{
      label: string;
      value: string;
    }>;
  };
}>();

const colors = ['#1a237e', '#0d47a1', '#2e7d32', '#f57c00', '#c62828'];

const getColor = (index: number) => colors[index % colors.length];

const getPoints = (points: number[]) => {
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - point;
      return `${x},${y}`;
    })
    .join(' ');
};
</script>

<style scoped>
.user-performance {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 14px;
  color: #666;
}

.metric-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.metric-chart {
  position: relative;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.metric-point {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
}

.metric-point:hover .metric-tooltip {
  opacity: 1;
}

.metric-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  white-space: nowrap;
}

.metric-line-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.performance-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #666;
}

.summary-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
</style> 