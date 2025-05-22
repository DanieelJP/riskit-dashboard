<template>
  <div class="error-distribution">
    <div class="chart-container">
      <div v-for="(value, index) in data.values" :key="index" class="error-bar">
        <div class="error-label">{{ data.labels[index] }}</div>
        <div class="error-bar-container">
          <div 
            class="error-bar-fill" 
            :style="{ width: `${value}%`, backgroundColor: getColor(index) }"
          >
            <span class="error-value">{{ value }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: {
    labels: string[];
    values: number[];
  };
}>();

const colors = ['#1a237e', '#0d47a1', '#2e7d32', '#f57c00', '#c62828'];

const getColor = (index: number) => colors[index % colors.length];
</script>

<style scoped>
.error-distribution {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.error-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-label {
  width: 120px;
  font-size: 14px;
  color: #666;
}

.error-bar-container {
  flex: 1;
  height: 24px;
  background-color: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
}

.error-bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 12px;
  transition: width 0.5s ease-in-out;
}

.error-value {
  color: white;
  font-size: 12px;
  font-weight: 500;
}
</style> 