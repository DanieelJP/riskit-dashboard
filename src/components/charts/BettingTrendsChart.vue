<template>
  <div class="betting-trends">
    <div class="chart-container">
      <div class="trend-line" v-for="(trend, index) in data.trends" :key="index">
        <div class="trend-info">
          <div class="trend-label">{{ trend.label }}</div>
          <div class="trend-value">{{ trend.value }}%</div>
        </div>
        <div class="trend-chart">
          <div 
            v-for="(point, pointIndex) in trend.points" 
            :key="pointIndex"
            class="trend-point"
            :style="{
              left: `${(pointIndex / (trend.points.length - 1)) * 100}%`,
              bottom: `${point}%`,
              backgroundColor: getColor(index)
            }"
          >
            <div class="trend-tooltip">
              {{ point }}%
            </div>
          </div>
          <svg class="trend-line-svg">
            <polyline
              :points="getPoints(trend.points)"
              :style="{ stroke: getColor(index) }"
              fill="none"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    trends: Array<{
      label: string;
      value: number;
      points: number[];
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
.betting-trends {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.trend-line {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trend-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trend-label {
  font-size: 14px;
  color: #666;
}

.trend-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.trend-chart {
  position: relative;
  height: 60px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.trend-point {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
}

.trend-point:hover .trend-tooltip {
  opacity: 1;
}

.trend-tooltip {
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

.trend-line-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style> 