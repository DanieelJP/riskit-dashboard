<template>
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-title>RisKit Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/business" router-direction="forward">
            Negocio
          </ion-button>
          <ion-button router-link="/technical" router-direction="forward">
            Técnico
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <router-view></router-view>
    </ion-content>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue';
</script>

<style>
:root {
  --primary-color: #1a237e;
  --secondary-color: #0d47a1;
  --success-color: #2e7d32;
  --warning-color: #f57c00;
  --danger-color: #c62828;
  --background-color: #f5f7fa;
  --text-color: #333;
  --text-secondary: #666;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

input, select, textarea {
  font-family: inherit;
  font-size: inherit;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

ion-header {
  --background: white;
  --border-color: #eee;
}

ion-toolbar {
  --padding-start: 16px;
  --padding-end: 16px;
}

ion-title {
  color: var(--primary-color);
  font-weight: 600;
}

ion-button {
  --color: var(--primary-color);
  font-weight: 500;
}

ion-content {
  --background: var(--background-color);
}
</style>