import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS, handleApiError, isSuccessfulResponse } from '../config/api';

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

export interface ArticuloProveedor {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  puntoPedido: number;
  proveedorId: number;
  esPredeterminado: boolean;
}

export interface CreateProveedorDTO {
  nombre: string;
  articulosProveedor: {
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

class ProveedorServiceReal {
  async findAll(): Promise<Proveedor[]> {
    const response = await apiGet(API_ENDPOINTS.PROVEEDORES);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async findById(id: number): Promise<Proveedor | null> {
    const response = await apiGet(API_ENDPOINTS.PROVEEDOR_BY_ID(id));
    if (response.status === 404) return null;
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async saveProveedor(proveedor: Omit<Proveedor, 'id' | 'fechaAlta'>): Promise<Proveedor> {
    const response = await apiPost(API_ENDPOINTS.PROVEEDORES, proveedor);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async createProveedorWithArticulos(data: CreateProveedorDTO): Promise<Proveedor> {
    const response = await apiPost(API_ENDPOINTS.PROVEEDORES, data);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async updateProveedor(id: number, data: Partial<Proveedor>): Promise<Proveedor> {
    const response = await apiPut(API_ENDPOINTS.PROVEEDOR_BY_ID(id), data);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async deleteById(id: number): Promise<void> {
    const response = await apiDelete(API_ENDPOINTS.PROVEEDOR_BY_ID(id));
    if (!isSuccessfulResponse(response)) await handleApiError(response);
  }

  async getArticulosPorProveedor(proveedorId: number): Promise<ArticuloProveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDOR_BY_ID(proveedorId)}/articulos`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async findActivos(): Promise<Proveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}?activo=true`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async findInactivos(): Promise<Proveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}?activo=false`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async searchProveedores(termino: string): Promise<Proveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}/search?q=${encodeURIComponent(termino)}`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async getEstadisticas(): Promise<any> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}/estadisticas`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async cambiarEstado(id: number, activo: boolean): Promise<Proveedor> {
    const response = await apiPut(`${API_ENDPOINTS.PROVEEDOR_BY_ID(id)}/estado`, { activo });
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async findConArticulosPredeterminados(): Promise<Proveedor[]> {
    const response = await apiGet(`${API_ENDPOINTS.PROVEEDORES}?conArticulosPredeterminados=true`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }
}

const proveedorServiceReal = new ProveedorServiceReal();
export default proveedorServiceReal; 