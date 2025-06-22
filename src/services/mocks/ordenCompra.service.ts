// Servicio mock para órdenes de compra
// Basado en el controlador Java: OrdenCompraController

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
  tiempoEntrega: number; // en días
  puntoPedido: number;
  costoOrden: number;
  observaciones: string;
}

// Datos mockeados de órdenes de compra
const ordenesCompraMock: OrdenCompra[] = [
  {
    id: 1,
    numero: "OC-2024-001",
    fechaCreacion: "2024-01-15",
    proveedor: {
      id: 1,
      nombre: "Proveedor A - Logitech",
      email: "contacto@logitech.com"
    },
    articulo: {
      id: 1,
      codigo: "A001",
      nombre: "Mouse Logitech G502 HERO",
      precio: 1500
    },
    cantidad: 25,
    precioUnitario: 1500,
    total: 37500,
    estado: "Pendiente",
    tiempoEntrega: 7,
    puntoPedido: 20,
    costoOrden: 5000,
    observaciones: "Urgente para stock"
  },
  {
    id: 2,
    numero: "OC-2024-002",
    fechaCreacion: "2024-01-16",
    proveedor: {
      id: 2,
      nombre: "Proveedor B - Corsair",
      email: "ventas@corsair.com"
    },
    articulo: {
      id: 2,
      codigo: "A002",
      nombre: "Teclado Mecánico Corsair K70",
      precio: 3000
    },
    cantidad: 15,
    precioUnitario: 3000,
    total: 45000,
    estado: "Enviada",
    tiempoEntrega: 10,
    puntoPedido: 15,
    costoOrden: 5000,
    observaciones: ""
  },
  {
    id: 3,
    numero: "OC-2024-003",
    fechaCreacion: "2024-01-17",
    proveedor: {
      id: 3,
      nombre: "Proveedor C - Samsung",
      email: "pedidos@samsung.com"
    },
    articulo: {
      id: 3,
      codigo: "A003",
      nombre: "Monitor LED 24\" Samsung FHD",
      precio: 25000
    },
    cantidad: 8,
    precioUnitario: 25000,
    total: 200000,
    estado: "Finalizada",
    tiempoEntrega: 5,
    puntoPedido: 5,
    costoOrden: 5000,
    observaciones: "Entrega confirmada"
  },
  {
    id: 4,
    numero: "OC-2024-004",
    fechaCreacion: "2024-01-18",
    proveedor: {
      id: 4,
      nombre: "Proveedor D - Sony",
      email: "ventas@sony.com"
    },
    articulo: {
      id: 4,
      codigo: "A004",
      nombre: "Auriculares Bluetooth Sony WH-1000XM4",
      precio: 8000
    },
    cantidad: 12,
    precioUnitario: 8000,
    total: 96000,
    estado: "Pendiente",
    tiempoEntrega: 8,
    puntoPedido: 10,
    costoOrden: 5000,
    observaciones: "Para venta online"
  },
  {
    id: 5,
    numero: "OC-2024-005",
    fechaCreacion: "2024-01-19",
    proveedor: {
      id: 1,
      nombre: "Proveedor A - Logitech",
      email: "contacto@logitech.com"
    },
    articulo: {
      id: 5,
      codigo: "A005",
      nombre: "Webcam HD Logitech C920",
      precio: 1200
    },
    cantidad: 20,
    precioUnitario: 1200,
    total: 24000,
    estado: "Cancelada",
    tiempoEntrega: 7,
    puntoPedido: 25,
    costoOrden: 5000,
    observaciones: "Cancelada por falta de stock del proveedor"
  }
];

class OrdenCompraService {
  // GET /orden-compra - Obtener todas las órdenes
  async findAll(): Promise<OrdenCompra[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular respuesta exitosa
    return [...ordenesCompraMock];
  }

  // GET /orden-compra/{id} - Obtener orden por ID
  async findById(id: number): Promise<OrdenCompra> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const orden = ordenesCompraMock.find(o => o.id === id);
    if (!orden) {
      throw new Error(`Orden de compra con ID ${id} no encontrada`);
    }
    
    return orden;
  }

  // POST /orden-compra - Crear nueva orden
  async saveOrdenCompra(ordenCompra: Omit<OrdenCompra, 'id' | 'numero' | 'fechaCreacion'>): Promise<OrdenCompra> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generar ID y número de orden
    const nuevoId = Math.max(...ordenesCompraMock.map(o => o.id)) + 1;
    const fechaActual = new Date().toISOString().split('T')[0];
    const numeroOrden = `OC-${new Date().getFullYear()}-${String(nuevoId).padStart(3, '0')}`;
    
    const nuevaOrden: OrdenCompra = {
      ...ordenCompra,
      id: nuevoId,
      numero: numeroOrden,
      fechaCreacion: fechaActual,
      total: ordenCompra.cantidad * ordenCompra.precioUnitario + ordenCompra.costoOrden
    };
    
    // Agregar a la lista mock
    ordenesCompraMock.push(nuevaOrden);
    
    return nuevaOrden;
  }

  // PUT /orden-compra/{id} - Actualizar orden existente
  async updateOrdenCompra(id: number, ordenCompra: Partial<OrdenCompra>): Promise<OrdenCompra> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = ordenesCompraMock.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error(`Orden de compra con ID ${id} no encontrada`);
    }
    
    // Actualizar la orden
    const ordenActualizada = {
      ...ordenesCompraMock[index],
      ...ordenCompra,
      id, // Mantener el ID original
      total: (ordenCompra.cantidad || ordenesCompraMock[index].cantidad) * 
             (ordenCompra.precioUnitario || ordenesCompraMock[index].precioUnitario) + 
             (ordenCompra.costoOrden || ordenesCompraMock[index].costoOrden)
    };
    
    ordenesCompraMock[index] = ordenActualizada;
    
    return ordenActualizada;
  }

  // DELETE /orden-compra/{id} - Eliminar orden
  async deleteById(id: number): Promise<void> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = ordenesCompraMock.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error(`Orden de compra con ID ${id} no encontrada`);
    }
    
    // Verificar que solo se puedan eliminar órdenes pendientes
    if (ordenesCompraMock[index].estado !== 'Pendiente') {
      throw new Error('Solo se pueden eliminar órdenes en estado Pendiente');
    }
    
    // Eliminar de la lista
    ordenesCompraMock.splice(index, 1);
  }

  // GET /orden-compra/articulo/{articuloId} - Obtener órdenes por artículo
  async findByArticulo(articuloId: number): Promise<OrdenCompra[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ordenes = ordenesCompraMock.filter(o => o.articulo.id === articuloId);
    return ordenes;
  }

  // Métodos adicionales útiles para el frontend

  // Obtener órdenes por estado
  async findByEstado(estado: OrdenCompra['estado']): Promise<OrdenCompra[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return ordenesCompraMock.filter(o => o.estado === estado);
  }

  // Obtener órdenes por proveedor
  async findByProveedor(proveedorId: number): Promise<OrdenCompra[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return ordenesCompraMock.filter(o => o.proveedor.id === proveedorId);
  }

  // Buscar órdenes por número, proveedor o artículo
  async searchOrdenes(termino: string): Promise<OrdenCompra[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const terminoLower = termino.toLowerCase();
    return ordenesCompraMock.filter(orden => 
      orden.numero.toLowerCase().includes(terminoLower) ||
      orden.proveedor.nombre.toLowerCase().includes(terminoLower) ||
      orden.articulo.nombre.toLowerCase().includes(terminoLower) ||
      orden.articulo.codigo.toLowerCase().includes(terminoLower)
    );
  }

  // Obtener estadísticas
  async getEstadisticas() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const total = ordenesCompraMock.length;
    const pendientes = ordenesCompraMock.filter(o => o.estado === 'Pendiente').length;
    const enviadas = ordenesCompraMock.filter(o => o.estado === 'Enviada').length;
    const finalizadas = ordenesCompraMock.filter(o => o.estado === 'Finalizada').length;
    const canceladas = ordenesCompraMock.filter(o => o.estado === 'Cancelada').length;
    const totalValor = ordenesCompraMock.reduce((sum, o) => sum + o.total, 0);

    return {
      total,
      pendientes,
      enviadas,
      finalizadas,
      canceladas,
      totalValor
    };
  }

  // Cambiar estado de una orden
  async cambiarEstado(id: number, nuevoEstado: OrdenCompra['estado']): Promise<OrdenCompra> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = ordenesCompraMock.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error(`Orden de compra con ID ${id} no encontrada`);
    }
    
    // Validar transiciones de estado
    const estadoActual = ordenesCompraMock[index].estado;
    const transicionesValidas: Record<string, string[]> = {
      'Pendiente': ['Enviada', 'Cancelada'],
      'Enviada': ['Finalizada', 'Cancelada'],
      'Finalizada': [],
      'Cancelada': []
    };
    
    if (!transicionesValidas[estadoActual].includes(nuevoEstado)) {
      throw new Error(`No se puede cambiar de estado ${estadoActual} a ${nuevoEstado}`);
    }
    
    ordenesCompraMock[index].estado = nuevoEstado;
    
    return ordenesCompraMock[index];
  }
}

// Exportar instancia única del servicio
const ordenCompraService = new OrdenCompraService();
export default ordenCompraService; 