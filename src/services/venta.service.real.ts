import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS, handleApiError, isSuccessfulResponse } from '../config/api';

export interface VentaArticulo {
  id: number;
  articuloId: number;
  articuloNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  fecha: string;
  cliente: string;
  articulos: VentaArticulo[];
  total: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada';
  metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  vendedor: string;
  observaciones?: string;
}

class VentaServiceReal {
  async findAll(): Promise<Venta[]> {
    const response = await apiGet(API_ENDPOINTS.VENTAS);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async findById(id: number): Promise<Venta | null> {
    const response = await apiGet(API_ENDPOINTS.VENTA_BY_ID(id));
    if (response.status === 404) return null;
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async saveVenta(venta: Omit<Venta, 'id'>): Promise<Venta> {
    const response = await apiPost(API_ENDPOINTS.VENTAS, venta);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async updateVenta(id: number, data: Partial<Venta>): Promise<Venta> {
    const response = await apiPut(API_ENDPOINTS.VENTA_BY_ID(id), data);
    if (!isSuccessfulResponse(response)) await handleApiError(response);
    return response.json();
  }

  async deleteById(id: number): Promise<void> {
    const response = await apiDelete(API_ENDPOINTS.VENTA_BY_ID(id));
    if (!isSuccessfulResponse(response)) await handleApiError(response);
  }
}

const ventaServiceReal = new VentaServiceReal();
export default ventaServiceReal; 