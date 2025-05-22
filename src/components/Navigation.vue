<template>
  <nav class="navigation">
    <div class="nav-links">
      <router-link to="/" class="nav-link" active-class="active">
        <span class="icon">📊</span>
        Dashboard de Negocio
      </router-link>
      <router-link to="/technical" class="nav-link" active-class="active">
        <span class="icon">⚙️</span>
        Dashboard Técnico
      </router-link>
      <router-link to="/kpis" class="nav-link" active-class="active">
        <span class="icon">📈</span>
        Lista de KPIs
      </router-link>
    </div>
  </nav>
</template> 