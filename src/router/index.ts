import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import BusinessDashboard from '@/views/BusinessDashboard.vue';
import TechnicalDashboard from '@/views/TechnicalDashboard.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/business'
  },
  {
    path: '/business',
    name: 'business',
    component: BusinessDashboard
  },
  {
    path: '/technical',
    name: 'technical',
    component: TechnicalDashboard
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;