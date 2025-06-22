import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS, handleApiError, isSuccessfulResponse } from '../config/api';

// Helper function to safely parse JSON
const safeJsonResponse = async <T>(response: Response): Promise<T | void> => {
  const text = await response.text();
  if (!text) {
    return; // Handle empty response
  }
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Failed to parse JSON response:', text);
    // Instead of throwing, we might return or handle it gracefully
    // For now, let's re-throw to be aware of backend issues
    throw new Error(`Invalid JSON response from server: ${error}`);
  }
};

export interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  cuit: string;
  contacto: string;
  activo: boolean;
  fechaAlta: string;
  observaciones?: string;
}

export interface ProveedorBackend {
  id: number;
  nombre: string;
  proveedorArticulos: any[];
}

export interface ArticuloProveedor {
  id?: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  puntoPedido?: number;
  proveedorId: number;
  esPredeterminado: boolean;
  demoraEntrega?: number;
  cargosPedido?: number;
  tiempoRevision?: number;
  tipoModelo?: string;
  // Campos del backend
  nombreArticulo?: string;
  articuloId?: number;
  precioUnitario?: number;
  descripcionArticulo?: string;
  nombreProveedor?: string;
}

export interface CreateProveedorDTO {
  nombre: string;
  proveedorArticulos: {
    demoraEntrega: number;
    precioUnitario: number;
    cargosPedido: number;
    articulo: {
      id: number;
      nombre: string;
      codArticulo: number;
    };
    tiempoRevision: number;
    tipoModelo: string;
  }[];
}

export interface UpdateProveedorDTO {
  nombre: string;
  direccion?: string;
  observaciones?: string;
  proveedorArticulos: {
    demoraEntrega: number;
    precioUnitario: number;
    cargosPedido: number;
    articulo: {
      id: number;
      nombre: string;
      codArticulo: number;
    };
    tiempoRevision: number;
    tipoModelo: string;
  }[];
}

export interface UpdateArticuloProveedorDTO {
  demoraEntrega: number;
  precioUnitario: number;
  cargosPedido: number;
  tiempoRevision: number;
  tipoModelo: string;
}

class ProveedorServiceReal {
  async findAll(): Promise<ProveedorBackend[]> {
    const response = await apiGet(API_ENDPOINTS.PROVEEDORES);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<ProveedorBackend[]>(response) || [];
  }

  async findById(id: number): Promise<Proveedor | null> {
    const response = await apiGet(API_ENDPOINTS.PROVEEDOR_BY_ID(id));
    if (response.status === 404) return null;
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor>(response) || null;
  }

  async saveProveedor(proveedor: Omit<Proveedor, 'id' | 'fechaAlta'>): Promise<Proveedor | void> {
    const response = await apiPost(API_ENDPOINTS.PROVEEDORES, proveedor);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor>(response);
  }

  async createProveedorWithArticulos(data: CreateProveedorDTO): Promise<Proveedor | void> {
    const response = await apiPost(API_ENDPOINTS.PROVEEDORES, data);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor>(response);
  }

  async updateProveedor(id: number, data: UpdateProveedorDTO): Promise<Proveedor | void> {
    const response = await apiPut(API_ENDPOINTS.PROVEEDOR_BY_ID(id), data);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor>(response);
  }

  async deleteById(id: number): Promise<void> {
    const response = await apiDelete(API_ENDPOINTS.PROVEEDOR_BY_ID(id));
    if (!isSuccessfulResponse(response)) await handleApiError(response);
  }

  async getArticulosPorProveedor(proveedorId: number): Promise<ArticuloProveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDOR_BY_ID(proveedorId)}/articulos`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<ArticuloProveedor[]>(response) || [];
  }

  async findActivos(): Promise<Proveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}?activo=true`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor[]>(response) || [];
  }

  async findInactivos(): Promise<Proveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}?activo=false`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor[]>(response) || [];
  }

  async searchProveedores(termino: string): Promise<Proveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}/search?q=${encodeURIComponent(termino)}`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor[]>(response) || [];
  }

  async getEstadisticas(): Promise<any> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}/estadisticas`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<any>(response);
  }

  async cambiarEstado(id: number, activo: boolean): Promise<Proveedor | void> {
    const response = await apiPut(`${API_ENDPOINTS.PROVEEDOR_BY_ID(id)}/estado`, { activo });
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor>(response);
  }

  async findConArticulosPredeterminados(): Promise<Proveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}?conArticulosPredeterminados=true`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor[]>(response) || [];
  }

  async updateArticuloProveedor(proveedorId: number, codArticulo: string, data: UpdateArticuloProveedorDTO): Promise<ArticuloProveedor | void> {
    const response = await apiPut(`${API_ENDPOINTS.PROVEEDOR_BY_ID(proveedorId)}/articulos/${codArticulo}`, data);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<ArticuloProveedor>(response);
  }

  async getArticuloProveedor(proveedorId: number, codArticulo: string): Promise<ArticuloProveedor | null> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDOR_BY_ID(proveedorId)}/articulos/${codArticulo}`);
    if (response.status === 404) return null;
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<ArticuloProveedor>(response) || null;
  }

  async darDeBaja(id: number): Promise<Proveedor | void> {
    const response = await apiPut(`${API_ENDPOINTS.PROVEEDORES}/baja/${id}`, {});
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return await safeJsonResponse<Proveedor>(response);
  }
}

const proveedorServiceReal = new ProveedorServiceReal();
export default proveedorServiceReal; 