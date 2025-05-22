<template>
  <div class="profit-distribution">
    <div class="chart-container">
      <div class="profit-segment" v-for="(segment, index) in data.segments" :key="index">
        <div class="segment-info">
          <div class="segment-label">{{ segment.label }}</div>
          <div class="segment-value">${{ segment.value.toLocaleString() }}</div>
        </div>
        <div class="segment-bar">
          <div 
            class="segment-fill"
            :style="{ 
              width: `${(segment.value / maxValue) * 100}%`,
              backgroundColor: getColor(index)
            }"
          >
            <div class="segment-percentage">
              {{ ((segment.value / totalValue) * 100).toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>
      <div class="chart-summary">
        <div class="summary-item">
          <span class="summary-label">Total:</span>
          <span class="summary-value">${{ totalValue.toLocaleString() }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Promedio:</span>
          <span class="summary-value">${{ (totalValue / data.segments.length).toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    segments: Array<{
      label: string;
      value: number;
    }>;
  };
}>();

const colors = ['#1a237e', '#0d47a1', '#2e7d32', '#f57c00', '#c62828'];

const getColor = (index: number) => colors[index % colors.length];

const totalValue = computed(() => {
  return props.data.segments.reduce((sum, segment) => sum + segment.value, 0);
});

const maxValue = computed(() => {
  return Math.max(...props.data.segments.map(segment => segment.value));
});
</script>

<style scoped>
.profit-distribution {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profit-segment {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.segment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.segment-label {
  font-size: 14px;
  color: #666;
}

.segment-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.segment-bar {
  height: 24px;
  background-color: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
}

.segment-fill {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: width 0.5s ease-in-out;
  position: relative;
}

.segment-percentage {
  color: white;
  font-size: 12px;
  font-weight: 500;
}

.chart-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-label {
  font-size: 14px;
  color: #666;
}

.summary-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
</style> 