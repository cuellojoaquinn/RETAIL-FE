import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS, handleApiError, isSuccessfulResponse } from '../config/api';

export interface OrdenCompra {
  id: number;
  numero: string;
  fechaCreacion: string;
  proveedor: {
    id: number;
    nombre: string;
    email: string;
  };
  articulo: {
    id: number;
    codigo: string;
    nombre: string;
    precio: number;
  };
  cantidad: number;
  precioUnitario: number;
  total: number;
  estado: 'Pendiente' | 'Enviada' | 'Finalizada' | 'Cancelada';
  tiempoEntrega: number;
  puntoPedido: number;
  costoOrden: number;
  observaciones: string;
}

class OrdenCompraServiceReal {
  async findAll(): Promise<OrdenCompra[]> {
    const response = await apiGet(API_ENDPOINTS.ORDENES_COMPRA);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async findById(id: number): Promise<OrdenCompra | null> {
    const response = await apiGet(API_ENDPOINTS.ORDEN_COMPRA_BY_ID(id));
    if (response.status === 404) return null;
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async saveOrden(orden: Omit<OrdenCompra, 'id'>): Promise<OrdenCompra> {
    const response = await apiPost(API_ENDPOINTS.ORDENES_COMPRA, orden);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async updateOrden(id: number, data: Partial<OrdenCompra>): Promise<OrdenCompra> {
    const response = await apiPut(API_ENDPOINTS.ORDEN_COMPRA_BY_ID(id), data);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async deleteById(id: number): Promise<void> {
    const response = await apiDelete(API_ENDPOINTS.ORDEN_COMPRA_BY_ID(id));
    if (!isSuccessfulResponse(response)) await handleApiError(response);
  }

  async getEstadisticas(): Promise<any> {
    const response = await apiGet(`${API_ENDPOINTS.ORDENES_COMPRA}/estadisticas`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async searchOrdenes(query: string): Promise<OrdenCompra[]> {
    const response = await apiGet(`${API_ENDPOINTS.ORDENES_COMPRA}/search?q=${encodeURIComponent(query)}`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async findByEstado(estado: string): Promise<OrdenCompra[]> {
    const response = await apiGet(`${API_ENDPOINTS.ORDENES_COMPRA}?estado=${encodeURIComponent(estado)}`);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }
}

const ordenCompraServiceReal = new OrdenCompraServiceReal();
export default ordenCompraServiceReal; 