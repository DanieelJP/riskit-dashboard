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
  --primary-color: #7c4dff;
  --primary-light: #b47cff;
  --primary-dark: #3f1dcb;
  --secondary-color: #00e5ff;
  --success-color: #00e676;
  --warning-color: #ffd600;
  --danger-color: #ff1744;
  --background-color: #121212;
  --surface-color: #1e1e1e;
  --card-color: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --border-color: #404040;
  --chart-grid-color: #404040;
  --chart-text-color: #b3b3b3;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--background-color);
  color: var(--text-primary);
  line-height: 1.5;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
  color: var(--text-primary);
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
  background-color: var(--surface-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 8px 12px;
}

a {
  color: var(--primary-light);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

ion-header {
  --background: var(--surface-color);
  --border-color: var(--border-color);
}

ion-toolbar {
  --padding-start: 16px;
  --padding-end: 16px;
  --background: var(--surface-color);
}

ion-title {
  color: var(--text-primary);
  font-weight: 600;
}

ion-button {
  --color: var(--text-primary) !important;
  --background: transparent !important;
  --background-hover: var(--surface-color) !important;
  --background-activated: var(--surface-color) !important;
  --ripple-color: var(--surface-color) !important;
  font-weight: 500;
  text-transform: none;
  --border-radius: 8px;
  --padding-start: 16px;
  --padding-end: 16px;
  color: var(--text-primary) !important;
}

ion-button.button-clear {
  --color: var(--text-primary) !important;
  --background: transparent !important;
  --background-hover: var(--surface-color) !important;
  --background-activated: var(--surface-color) !important;
  color: var(--text-primary) !important;
}

ion-button.button-clear:hover {
  --background: var(--surface-color) !important;
  opacity: 0.9;
}

ion-content {
  --background: var(--background-color);
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--surface-color);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-dark);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}
</style>