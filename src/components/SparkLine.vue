<template>
  <div :class="['box-sparkline', bgColor, textColor]">
    <div class="details">
      <div>
        <ion-icon :name="iconName"></ion-icon>
        <span>{{ title }}</span>
      </div>
      <span>{{ value }}</span>
    </div>
    <vapexChart class="sparkline-chart" :height="chartHeight" :options="chartOptions" :series="chartSeries">
    </vapexChart>
  </div>
</template>


<script setup lang="ts">


import { IonIcon } from '@ionic/vue';
import { addIcons } from 'ionicons';
import { navigateOutline, logoIonic, eyeOutline, peopleOutline, cashOutline, personOutline, personAddOutline, timeOutline, alertCircleOutline, serverOutline } from 'ionicons/icons';
import vapexChart from 'vue3-apexcharts';
import { ref, watchEffect, onUnmounted } from 'vue';


// 📌 Registrar iconos
addIcons({
  'logo-ionic': logoIonic,
  'navigate-outline': navigateOutline,
  'eye-outline': eyeOutline,
  'people-outline': peopleOutline,
  'cash-outline': cashOutline,
  'person-outline': personOutline,
  'person-add-outline': personAddOutline,
  'time-outline': timeOutline,
  'alert-circle-outline':alertCircleOutline,
  'server-outline': serverOutline
});


// 📌 Definir Props para datos dinámicos
defineProps({
  title: { type: String, default: 'Metrica', },
  value: { type: String, default: '#Value', },
  chartOptions: { type: Object, required: true, }, // Se espera un objeto de configuración de ApexCharts
  chartSeries: { type: Array, required: true, }, // Se espera un array con los datos de la serie
  bgColor: { type: String, default: '', },
  textColor: { type: String, default: '', },
  iconName: { type: String, default: 'logo-ionic', },
});






/******* Control altura gráfico según ancho ********************/


const chartHeight = ref("50%");


// Función que ajusta la altura dinámicamente
const updateChartHeight = () => {
  const width = window.innerWidth;


  if (width < 576) chartHeight.value = "30%"; // Breakpoint xs
  else if (width < 768) chartHeight.value = "40%"; // Breakpoint sm
  else chartHeight.value = "50%"; // Breakpoint md y superiores
};


// Ejecutar al cargar y escuchar cambios en el tamaño de la ventana
watchEffect(() => {
  updateChartHeight();
  window.addEventListener("resize", updateChartHeight);
});


// Limpiar el listener cuando el componente se desmonta
onUnmounted(() => {
  window.removeEventListener("resize", updateChartHeight);
});


/************************************************************ */


</script>


<style scoped>
/* Mobile first */


.box-sparkline {
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 100%;
  padding: 16px;
  border-radius: 5px;
  container: box / inline-size;
}


.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}


.details>div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}


.details>div>ion-icon {
  font-size: 2rem;
  --ionicon-stroke-width: 24px;
}


.details>div>span {
  font-size: .8rem;
}

.details>span {
  font-size: 2.9rem;
}


.sparkline-chart {
  min-width: 50px;
  width: 100%;
}


/* Siendo más ancho, pasamos dato a la derecha de título */


@container box (width >=324px) {
  .details {
    flex-direction: row;
    justify-content: space-start;
    align-items: start;
    gap: 16px;
  }


  .details>span {
    font-size: 6cqmax;
  }

  .details>div>ion-icon {
    font-size: 4cqmax;
  }

  .details>div>span {
    font-size: 2cqmax;
  }
}


/* 🖥️ En pantallas grandes (>=lg=992) */
@media (min-width: 992px) {

  /* Si el componente no es muy ancho: detalles izquierda, datos derecha*/
  @container box (width <=356px) {
    .details {
      flex-direction: row;
      justify-content: space-start;
      align-items: start;
      gap: 16px;
    }

    /* Para anchos de contenedores muy pequeños */
    .details>span {
      font-size: max(1.7rem, 16cqw);
    }

    .details>div>ion-icon {
      font-size: max(1.7rem, 5cqw);
    }

    .details>div>span {
      font-size: max(0.8rem, 5cqw);
    }
  }
}


/* 🎨 Colores de fondo */
.gradient-blue {
  background-image: linear-gradient(135deg, #071c49 10%, #0396FF 100%);
}

.gradient-green {
  background-image: linear-gradient(135deg, #054d43 10%, #6be084 100%);
}

.gradient-orange {
  background-image: linear-gradient(135deg, #f31b4a 10%, #e78f30 100%);
}

.gradient-pink {
  background-image: linear-gradient(135deg, #383ead 10%, #EE9AE5 100%);
}

.gradient-purple {
  background-image: linear-gradient(135deg, #7e5bef, #d65db1 100%);
}


.black {
  color: black
}

.white {
  color: white;
}
</style>
