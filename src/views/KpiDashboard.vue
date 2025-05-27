<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>🎯 KPIs</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">🎯 KPIs</ion-title>
        </ion-toolbar>
      </ion-header>

      <h1 class="ion-padding">💰 KPIs de Negocio</h1>
      <ion-accordion-group expand="inset" :multiple="true">
        <ion-accordion v-for="item in negocio" :key="item.id" :value="item.id.toString()">
          <ion-item slot="header">
            <ion-label>{{ item.id }}. {{ item.title }}</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>{{ item.description }}</p>
            <ion-list :inset="true">
              <ion-item v-for="(element, index) in item.smart" :key="index">
                <ion-label><b>{{ element.letter }}</b> → {{ element.content }}</ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
      </ion-accordion-group>

      <h1 class="ion-padding">⚙️ KPIs Técnicos</h1>
      <ion-accordion-group expand="inset" :multiple="true">
        <ion-accordion v-for="item in tecnicos" :key="item.id" :value="item.id.toString()">
          <ion-item slot="header">
            <ion-label>{{ item.id }}. {{ item.title }}</ion-label>
          </ion-item>
          <div class="ion-padding" slot="content">
            <p>{{ item.description }}</p>
            <ion-list :inset="true">
              <ion-item v-for="(element, index) in item.smart" :key="index">
                <ion-label><b>{{ element.letter }}</b> → {{ element.content }}</ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList } from '@ionic/vue';
import { ref } from 'vue';

interface SmartElement {
  letter: string;
  content: string;
}

interface SmartGoal {
  id: number;
  title: string;
  description: string;
  smart: SmartElement[];
}

// KPIs SMART adaptados a nuestra aplicación de apuestas
const negocio = ref<SmartGoal[]>([
  {
    id: 1,
    title: "Incrementar Ingresos por Apuestas",
    description: "Aumentar los ingresos totales por apuestas en un 25% durante los próximos 3 meses mediante promociones estratégicas y mejora de la experiencia de usuario.",
    smart: [
      { letter: "S", content: "Aumentar los ingresos totales por apuestas" },
      { letter: "M", content: "25% en 3 meses" },
      { letter: "A", content: "con promociones y mejoras en UX" },
      { letter: "R", content: "para maximizar el valor de las apuestas" },
      { letter: "T", content: "durante los próximos 3 meses" }
    ]
  },
  {
    id: 2,
    title: "Mejorar Tasa de Conversión",
    description: "Aumentar la tasa de conversión de visitantes a apostadores del 3.2% al 4.5% en los próximos 2 meses mediante optimización del proceso de apuesta.",
    smart: [
      { letter: "S", content: "Aumentar la tasa de conversión de visitantes" },
      { letter: "M", content: "del 3.2% al 4.5%" },
      { letter: "A", content: "optimizando el proceso de apuesta" },
      { letter: "R", content: "para maximizar el número de apostadores activos" },
      { letter: "T", content: "en 2 meses" }
    ]
  },
  {
    id: 3,
    title: "Aumentar Valor Promedio de Apuestas",
    description: "Incrementar el valor promedio de apuesta de 45€ a 60€ mediante estrategias de upselling y bonificaciones por volumen.",
    smart: [
      { letter: "S", content: "Incrementar el valor promedio de apuesta" },
      { letter: "M", content: "de 45€ a 60€" },
      { letter: "A", content: "con upselling y bonificaciones" },
      { letter: "R", content: "para aumentar el ticket medio" },
      { letter: "T", content: "en el próximo trimestre" }
    ]
  },
  {
    id: 4,
    title: "Mejorar Retención de Usuarios",
    description: "Aumentar la tasa de retención de usuarios del 78% al 85% mediante programas de fidelización y mejoras en la experiencia post-apuesta.",
    smart: [
      { letter: "S", content: "Aumentar la tasa de retención de usuarios" },
      { letter: "M", content: "del 78% al 85%" },
      { letter: "A", content: "con programas de fidelización" },
      { letter: "R", content: "para mantener usuarios activos" },
      { letter: "T", content: "en 6 meses" }
    ]
  },
  {
    id: 5,
    title: "Optimizar Ratio de Ganancias",
    description: "Mantener el ratio de ganancias/pérdidas en 1.8x o superior mediante análisis de riesgo y ajuste dinámico de cuotas.",
    smart: [
      { letter: "S", content: "Mantener ratio de ganancias/pérdidas" },
      { letter: "M", content: "en 1.8x o superior" },
      { letter: "A", content: "con análisis de riesgo y ajuste de cuotas" },
      { letter: "R", content: "para garantizar rentabilidad" },
      { letter: "T", content: "de forma continua" }
    ]
  }
]);

const tecnicos = ref<SmartGoal[]>([
  {
    id: 1,
    title: "Optimizar Tiempo de Respuesta",
    description: "Reducir el tiempo de respuesta del servidor de 245ms a menos de 200ms en los próximos 2 meses mediante optimización de consultas y caché.",
    smart: [
      { letter: "S", content: "Reducir el tiempo de respuesta del servidor" },
      { letter: "M", content: "de 245ms a menos de 200ms" },
      { letter: "A", content: "optimizando consultas y caché" },
      { letter: "R", content: "para mejorar la experiencia de usuario" },
      { letter: "T", content: "en 2 meses" }
    ]
  },
  {
    id: 2,
    title: "Minimizar Errores en Transacciones",
    description: "Reducir la tasa de errores en transacciones del 0.8% al 0.3% mediante mejoras en la validación y manejo de errores.",
    smart: [
      { letter: "S", content: "Reducir la tasa de errores en transacciones" },
      { letter: "M", content: "del 0.8% al 0.3%" },
      { letter: "A", content: "mejorando validación y manejo de errores" },
      { letter: "R", content: "para aumentar la confiabilidad del sistema" },
      { letter: "T", content: "en 3 meses" }
    ]
  },
  {
    id: 3,
    title: "Mejorar Tiempo de Carga",
    description: "Reducir el tiempo de carga de la aplicación de 1.8s a 1.2s mediante optimización de assets y lazy loading.",
    smart: [
      { letter: "S", content: "Reducir el tiempo de carga de la aplicación" },
      { letter: "M", content: "de 1.8s a 1.2s" },
      { letter: "A", content: "optimizando assets y lazy loading" },
      { letter: "R", content: "para mejorar la experiencia inicial" },
      { letter: "T", content: "en 2 meses" }
    ]
  },
  {
    id: 4,
    title: "Maximizar Tasa de Éxito en Pagos",
    description: "Mantener la tasa de éxito en pagos por encima del 99.2% mediante mejoras en la integración con pasarelas de pago.",
    smart: [
      { letter: "S", content: "Mantener alta tasa de éxito en pagos" },
      { letter: "M", content: "por encima del 99.2%" },
      { letter: "A", content: "mejorando integración con pasarelas" },
      { letter: "R", content: "para minimizar fallos en transacciones" },
      { letter: "T", content: "de forma continua" }
    ]
  },
  {
    id: 5,
    title: "Optimizar Sesiones Concurrentes",
    description: "Mantener un máximo de 1250 sesiones concurrentes con respuesta óptima mediante escalado horizontal y balanceo de carga.",
    smart: [
      { letter: "S", content: "Mantener rendimiento con sesiones concurrentes" },
      { letter: "M", content: "máximo 1250 sesiones" },
      { letter: "A", content: "con escalado horizontal y balanceo" },
      { letter: "R", content: "para garantizar estabilidad" },
      { letter: "T", content: "de forma continua" }
    ]
  }
]);
</script>

<style scoped>
ion-content {
  --background: var(--background-color);
}

h1 {
  color: var(--text-primary);
  font-size: 24px;
  margin: 20px 0;
}

ion-item {
  --background: var(--card-color);
  --color: var(--text-primary);
  margin: 8px 0;
  border-radius: 8px;
}

ion-label {
  color: var(--text-primary);
}

p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

ion-list {
  background: transparent;
}

ion-accordion {
  margin: 8px 0;
  border-radius: 8px;
  background: var(--card-color);
}

ion-accordion::part(header) {
  background: var(--card-color);
  border-radius: 8px;
}

ion-accordion::part(content) {
  background: var(--surface-color);
  border-radius: 0 0 8px 8px;
}
</style> 