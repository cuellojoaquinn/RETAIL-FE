// 📁 src/services/articulo.service.real.ts
// Ejemplo de implementación real del servicio de artículos usando la configuración centralizada

import { 
  apiGet, 
  apiPost, 
  apiPut, 
  apiDelete, 
  API_ENDPOINTS, 
  handleApiError, 
  isSuccessfulResponse 
} from '../config/api';

export interface Articulo {
  id: number;
  codArticulo: number;
  codigo?: string;
  nombre: string;
  descripcion: string;
  produccionDiaria: number;
  demandaArticulo: number;
  costoAlmacenamiento: number;
  costoVenta: number;
  fechaBajaArticulo: string | null;
  puntoPedido: number;
  stockSeguridad: number;
  inventarioMaximo: number;
  loteOptimo: number;
  stockActual: number;
  z: number;
  desviacionEstandar: number;
  proveedorPredeterminado: number | null;
  cgi: number;
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ArticuloDTO {
  codArticulo: number;
  nombre: string;
  descripcion: string;
  costoAlmacenamiento: number;
  demandaArticulo: number;
  costoVenta: number;
  stockActual: number;
  produccionDiaria: number;
  z: number;
  desviacionEstandar: number;
}

export interface EditarArticuloDTO {
  nombre: string;
  descripcion: string;
  demandaArticulo: number;
  costoAlmacenamiento: number;
  costoVenta: number;
  stockActual: number;
  produccionDiaria: number;
  z: number;
  desviacionEstandar: number;
  proveedorPredeterminado?: number | null;
}

export interface CrearArticuloDTO {
  nombre: string;
  descripcion: string;
  costoAlmacenamiento: number;
  demandaArticulo: number;
  costoVenta: number;
  stockActual: number;
  produccionDiaria: number;
  z: number;
  desviacionEstandar: number;
  codArticulo?: number;
}

// Nueva interfaz para artículos de orden de compra
export interface ArticuloOrdenCompra {
  idArticulo: number;
  codArticulo: number;
  nombreArticulo: string;
  idProveedorPredeterminado: number;
  nombreProveedorPredeterminado: string;
  loteOptimo: number;
}

class ArticuloServiceReal {
  // GET /articulos - Obtener todos los artículos con paginación
  async findAll(page: number = 0, size: number = 10): Promise<Page<Articulo>> {
    try {
      const response = await apiGet(`${API_ENDPOINTS.ARTICULOS}?page=${page}&size=${size}`);
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo artículos:', error);
      throw error;
    }
  }

  // GET /articulos/{id} - Obtener artículo por ID
  async findById(id: number): Promise<Articulo | null> {
    try {
      const response = await apiGet(API_ENDPOINTS.ARTICULO_BY_ID(id));
      
      if (response.status === 404) {
        return null;
      }
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo artículo:', error);
      throw error;
    }
  }

  // POST /articulos - Crear nuevo artículo
  async saveArticulo(articulo: CrearArticuloDTO): Promise<Articulo | void> {
    try {
      const response = await apiPost(API_ENDPOINTS.ARTICULOS, articulo);
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
  
      const text = await response.text();
      if (!text) {
        return; // Éxito si la respuesta está vacía
      }

      try {
        // Intenta parsear como JSON
        return JSON.parse(text) as Articulo;
      } catch (e) {
        // Si falla, asume que es un mensaje de texto de éxito
        console.log("Respuesta no es JSON, pero se considera éxito:", text);
        return;
      }
    } catch (error) {
      console.error('Error guardando artículo:', error);
      throw error;
    }
  }

  // PUT /articulos/{id} - Actualizar artículo
  async updateArticulo(id: number, articuloData: EditarArticuloDTO): Promise<Articulo | void> {
    try {
      const response = await apiPut(API_ENDPOINTS.ARTICULO_BY_ID(id), articuloData);
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      const text = await response.text();
      if (!text) {
        return; // Éxito si la respuesta está vacía
      }

      try {
        // Intenta parsear como JSON
        return JSON.parse(text) as Articulo;
      } catch (e) {
        // Si falla, asume que es un mensaje de texto de éxito (ej. "Actualizado")
        console.log("Respuesta no es JSON, pero se considera éxito:", text);
        return;
      }
    } catch (error) {
      console.error('Error actualizando artículo:', error);
      throw error;
    }
  }

  // PUT /articulos/baja/{id} - Baja lógica de artículo
  async deleteById(id: number): Promise<void> {
    try {
      const response = await apiPut(API_ENDPOINTS.ARTICULO_BAJA_BY_ID(id));
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
    } catch (error) {
      console.error('Error eliminando artículo:', error);
      throw error;
    }
  }

  // PUT /articulos/{id}/proveedor-predeterminado - Establecer proveedor predeterminado
  async setProveedorPredeterminado(id: number, proveedorId?: number): Promise<Articulo | void> {
    try {
      const payload = { proveedorId };
      console.log('Enviando payload a setProveedorPredeterminado:', payload);
      
      const response = await apiPut(`${API_ENDPOINTS.ARTICULO_BY_ID(id)}/proveedor-predeterminado`, payload);
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      const text = await response.text();
      if (!text) {
        return; // Éxito si la respuesta está vacía
      }

      try {
        // Intenta parsear como JSON
        return JSON.parse(text) as Articulo;
      } catch (e) {
        // Si falla, asume que es un mensaje de texto de éxito
        console.log("Respuesta no es JSON, pero se considera éxito:", text);
        return;
      }
    } catch (error) {
      console.error('Error estableciendo proveedor predeterminado:', error);
      throw error;
    }
  }

  // GET /articulos/a-reponer - Obtener artículos que necesitan reposición
  async getArticulosAReponer(): Promise<Articulo[]> {
    try {
      const response = await apiGet(API_ENDPOINTS.ARTICULOS_A_REPONER);
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo artículos a reponer:', error);
      throw error;
    }
  }

  // GET /articulos/faltantes - Obtener artículos sin stock
  async getArticulosFaltantes(): Promise<Articulo[]> {
    try {
      const response = await apiGet(API_ENDPOINTS.ARTICULOS_FALTANTES);
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo artículos faltantes:', error);
      throw error;
    }
  }

  // GET /articulos/search?q={query} - Buscar artículos
  async searchArticulos(query: string): Promise<Articulo[]> {
    try {
      const response = await apiGet(API_ENDPOINTS.ARTICULOS_SEARCH(query));
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error buscando artículos:', error);
      throw error;
    }
  }

  // GET /articulos/estado/{estado} - Obtener artículos por estado
  async getArticulosByEstado(estado: 'Activo' | 'Inactivo'): Promise<Articulo[]> {
    try {
      const response = await apiGet(`${API_ENDPOINTS.ARTICULOS}/estado/${estado}`);
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo artículos por estado:', error);
      throw error;
    }
  }

  // GET /articulos/tipo/{tipoModelo} - Obtener artículos por tipo de modelo
  async getArticulosByTipoModelo(tipoModelo: string): Promise<Articulo[]> {
    try {
      const response = await apiGet(`${API_ENDPOINTS.ARTICULOS}/tipo/${encodeURIComponent(tipoModelo)}`);
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo artículos por tipo:', error);
      throw error;
    }
  }

  // GET /articulos/a-asignar - Obtener artículos que pueden ser asignados a proveedores
  async findArticulosAAsignar(): Promise<Articulo[]> {
    try {
      const response = await apiGet(API_ENDPOINTS.ARTICULOS_A_ASIGNAR);
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo artículos a asignar:', error);
      throw error;
    }
  }

  // GET /articulos/orden - Obtener artículos para órdenes de compra
  async getArticulosParaOrdenCompra(): Promise<ArticuloOrdenCompra[]> {
    try {
      const response = await apiGet(`${API_ENDPOINTS.ARTICULOS}/orden`);
      
      if (!isSuccessfulResponse(response)) {
        await handleApiError(response);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo artículos para orden de compra:', error);
      throw error;
    }
  }
}

// Exportar una instancia singleton
const articuloServiceReal = new ArticuloServiceReal();
export default articuloServiceReal;