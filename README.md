# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Configuración de la API

### Variables de Entorno

El proyecto usa variables de entorno para configurar la URL de la API. Para configurar:

1. **Copia el archivo de ejemplo:**
   ```bash
   cp env.example .env.local
   ```

2. **Edita `.env.local` y cambia la URL de la API:**
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

### Configuración Centralizada

La configuración de la API está centralizada en `src/config/api.ts`. Este archivo incluye:

- **URL base de la API** (configurable por variables de entorno)
- **Funciones helper** para peticiones HTTP (`apiGet`, `apiPost`, `apiPut`, `apiDelete`)
- **Endpoints predefinidos** para todos los recursos
- **Manejo de errores** consistente

### Uso en el código

```typescript
import { apiGet, apiPost, API_ENDPOINTS } from '../config/api';

// Obtener artículos
const response = await apiGet(API_ENDPOINTS.ARTICULOS);

// Crear un artículo
const newArticle = await apiPost(API_ENDPOINTS.ARTICULOS, articleData);

// Obtener artículo por ID
const article = await apiGet(API_ENDPOINTS.ARTICULO_BY_ID(123));
```

### Cambiar la URL de la API

Para cambiar la URL de la API, simplemente edita el archivo `.env.local`:

```env
# Desarrollo local
VITE_API_BASE_URL=http://localhost:3000

# Servidor de desarrollo
VITE_API_BASE_URL=http://dev-api.tudominio.com

# Producción
VITE_API_BASE_URL=https://api.tudominio.com
```

## Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
