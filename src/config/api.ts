// 📁 src/config/api.ts
// Configuración centralizada para la API

// URL base de la API - se puede cambiar desde aquí
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Configuración por defecto para las peticiones
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  // Remover slash inicial si existe para evitar doble slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Función helper para hacer peticiones HTTP con configuración por defecto
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

// Función helper para peticiones GET
export const apiGet = async (endpoint: string): Promise<Response> => {
  return apiRequest(endpoint, { method: 'GET' });
};

// Función helper para peticiones POST
export const apiPost = async (endpoint: string, data?: any): Promise<Response> => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// Función helper para peticiones PUT
export const apiPut = async (endpoint: string, data?: any): Promise<Response> => {
  console.log("apiPut", endpoint, data);
  return apiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

// Función helper para peticiones DELETE
export const apiDelete = async (endpoint: string): Promise<Response> => {
  return apiRequest(endpoint, { method: 'DELETE' });
};

// Endpoints específicos de la aplicación
export const API_ENDPOINTS = {
  // Artículos
  ARTICULOS: 'articulos',
  ARTICULO_BY_ID: (id: string | number) => `articulos/${id}`,
  ARTICULO_BAJA_BY_ID: (id: string | number) => `articulos/baja/${id}`,
  ARTICULOS_SEARCH: (query: string) => `articulos/search?q=${encodeURIComponent(query)}`,
  ARTICULOS_A_REPONER: 'articulos/a-reponer',
  ARTICULOS_FALTANTES: 'articulos/faltantes',
  ARTICULOS_A_ASIGNAR: 'articulos/a-asignar',
  
  // Órdenes de compra
  ORDENES_COMPRA: 'orden-compra',
  ORDEN_COMPRA_BY_ID: (id: string | number) => `ordenes-compra/${id}`,
  
  // Proveedores
  PROVEEDORES: 'proveedores',
  PROVEEDOR_BY_ID: (id: string | number) => `proveedores/${id}`,
  
  // Ventas
  VENTAS: 'ventas',
  VENTA_BY_ID: (id: string | number) => `ventas/${id}`,
} as const;

// Función para manejar errores de API de forma consistente
export const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'Error en la petición';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    // Si no se puede parsear el JSON, usar el status text
    errorMessage = response.statusText || errorMessage;
  }
  
  throw new Error(`${errorMessage} (${response.status})`);
};

// Función para verificar si la respuesta es exitosa
export const isSuccessfulResponse = (response: Response): boolean => {
  return response.ok; // status >= 200 && status < 300
}; 