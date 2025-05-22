# RisKit Dashboard

Dashboard moderno para una aplicación de apuestas, construido con Vue 3, TypeScript y Vite.

## Características

- KPIs principales con tendencias
- Gráficos interactivos y personalizados
- Diseño responsivo
- Tema moderno y profesional
- Visualización de datos en tiempo real

## Requisitos

- Node.js 16.x o superior
- npm 7.x o superior

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/riskit-dashboard.git
cd riskit-dashboard
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## Estructura del Proyecto

```
riskit-dashboard/
├── src/
│   ├── components/
│   │   └── charts/
│   │       ├── BettingTrendsChart.vue
│   │       ├── ErrorDistributionChart.vue
│   │       ├── ProfitDistributionChart.vue
│   │       └── UserPerformanceChart.vue
│   ├── views/
│   │   └── Dashboard.vue
│   ├── router/
│   │   └── index.ts
│   ├── types/
│   │   └── shims-vue.d.ts
│   ├── App.vue
│   └── main.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm run preview` - Vista previa de la versión de producción

## Tecnologías Utilizadas

- Vue 3
- TypeScript
- Vite
- Vue Router
- CSS Grid y Flexbox

## Contribuir

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
