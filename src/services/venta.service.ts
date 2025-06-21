// 📁 src/services/venta.service.ts
// Mock del servicio de ventas basado en el controlador Java

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

// Datos mockeados de ventas
const ventasMock: Venta[] = [
  {
    id: 1,
    fecha: '2024-01-15',
    cliente: 'Juan Pérez',
    articulos: [
      { id: 1, articuloId: 1, articuloNombre: 'Mouse Logitech G502 HERO', cantidad: 2, precioUnitario: 1500, subtotal: 3000 }
    ],
    total: 3000,
    estado: 'Completada',
    metodoPago: 'Tarjeta',
    vendedor: 'María González',
    observaciones: 'Cliente frecuente, descuento aplicado'
  },
  {
    id: 2,
    fecha: '2024-01-16',
    cliente: 'María García',
    articulos: [
      { id: 2, articuloId: 3, articuloNombre: 'Monitor LED 24" Samsung FHD', cantidad: 1, precioUnitario: 25000, subtotal: 25000 }
    ],
    total: 25000,
    estado: 'Completada',
    metodoPago: 'Transferencia',
    vendedor: 'Carlos Rodríguez',
    observaciones: 'Entrega programada para el lunes'
  },
  {
    id: 3,
    fecha: '2024-01-17',
    cliente: 'Carlos López',
    articulos: [
      { id: 3, articuloId: 4, articuloNombre: 'Auriculares Bluetooth Sony WH-1000XM4', cantidad: 1, precioUnitario: 8000, subtotal: 8000 }
    ],
    total: 8000,
    estado: 'Pendiente',
    metodoPago: 'Efectivo',
    vendedor: 'Ana Martínez',
    observaciones: 'Pendiente de pago'
  },
  {
    id: 4,
    fecha: '2024-01-18',
    cliente: 'Ana Rodríguez',
    articulos: [
      { id: 4, articuloId: 8, articuloNombre: 'Impresora Láser HP LaserJet Pro', cantidad: 1, precioUnitario: 90000, subtotal: 90000 }
    ],
    total: 90000,
    estado: 'Completada',
    metodoPago: 'Tarjeta',
    vendedor: 'Luis Fernández',
    observaciones: 'Instalación incluida'
  },
  {
    id: 5,
    fecha: '2024-01-19',
    cliente: 'Luis Martínez',
    articulos: [
      { id: 5, articuloId: 10, articuloNombre: 'Placa de Video RTX 4060 MSI', cantidad: 1, precioUnitario: 400000, subtotal: 400000 }
    ],
    total: 400000,
    estado: 'Completada',
    metodoPago: 'Transferencia',
    vendedor: 'Sofía Torres',
    observaciones: 'Armado de PC incluido'
  },
  {
    id: 6,
    fecha: '2024-01-20',
    cliente: 'Sofía Torres',
    articulos: [
      { id: 6, articuloId: 16, articuloNombre: 'Laptop Dell Inspiron 15 3000', cantidad: 1, precioUnitario: 350000, subtotal: 350000 }
    ],
    total: 350000,
    estado: 'Pendiente',
    metodoPago: 'Tarjeta',
    vendedor: 'Roberto Silva',
    observaciones: 'En espera de confirmación bancaria'
  },
  {
    id: 7,
    fecha: '2024-01-21',
    cliente: 'Roberto Silva',
    articulos: [
      { id: 7, articuloId: 14, articuloNombre: 'Tablet Samsung Galaxy Tab S7', cantidad: 1, precioUnitario: 180000, subtotal: 180000 }
    ],
    total: 180000,
    estado: 'Completada',
    metodoPago: 'Efectivo',
    vendedor: 'Patricia Morales',
    observaciones: 'Garantía extendida incluida'
  },
  {
    id: 8,
    fecha: '2024-01-22',
    cliente: 'Patricia Morales',
    articulos: [
      { id: 8, articuloId: 19, articuloNombre: 'Monitor 27" 4K LG UltraFine', cantidad: 1, precioUnitario: 450000, subtotal: 450000 }
    ],
    total: 450000,
    estado: 'Completada',
    metodoPago: 'Transferencia',
    vendedor: 'Fernando Herrera',
    observaciones: 'Configuración profesional incluida'
  },
  {
    id: 9,
    fecha: '2024-01-23',
    cliente: 'Fernando Herrera',
    articulos: [
      { id: 9, articuloId: 11, articuloNombre: 'Disco Duro 2TB Seagate Barracuda', cantidad: 3, precioUnitario: 7500, subtotal: 22500 }
    ],
    total: 22500,
    estado: 'Pendiente',
    metodoPago: 'Efectivo',
    vendedor: 'Carmen Vega',
    observaciones: 'Instalación de red incluida'
  },
  {
    id: 10,
    fecha: '2024-01-24',
    cliente: 'Carmen Vega',
    articulos: [
      { id: 10, articuloId: 17, articuloNombre: 'Procesador Intel Core i7-12700K', cantidad: 1, precioUnitario: 280000, subtotal: 280000 }
    ],
    total: 280000,
    estado: 'Completada',
    metodoPago: 'Tarjeta',
    vendedor: 'Diego Mendoza',
    observaciones: 'Overclocking incluido'
  },
  {
    id: 11,
    fecha: '2024-01-25',
    cliente: 'Diego Mendoza',
    articulos: [
      { id: 11, articuloId: 1, articuloNombre: 'Mouse Logitech G502 HERO', cantidad: 5, precioUnitario: 1500, subtotal: 7500 }
    ],
    total: 7500,
    estado: 'Completada',
    metodoPago: 'Efectivo',
    vendedor: 'Valeria Castro',
    observaciones: 'Configuración gaming incluida'
  },
  {
    id: 12,
    fecha: '2024-01-26',
    cliente: 'Valeria Castro',
    articulos: [
      { id: 12, articuloId: 16, articuloNombre: 'Laptop Dell Inspiron 15 3000', cantidad: 1, precioUnitario: 350000, subtotal: 350000 }
    ],
    total: 350000,
    estado: 'Pendiente',
    metodoPago: 'Transferencia',
    vendedor: 'Miguel Ríos',
    observaciones: 'Software de oficina incluido'
  },
  {
    id: 13,
    fecha: '2024-01-27',
    cliente: 'Miguel Ríos',
    articulos: [
      { id: 13, articuloId: 11, articuloNombre: 'Disco Duro 2TB Seagate Barracuda', cantidad: 2, precioUnitario: 7500, subtotal: 15000 }
    ],
    total: 15000,
    estado: 'Completada',
    metodoPago: 'Tarjeta',
    vendedor: 'Isabella Moreno',
    observaciones: 'Configuración de red incluida'
  },
  {
    id: 14,
    fecha: '2024-01-28',
    cliente: 'Isabella Moreno',
    articulos: [
      { id: 14, articuloId: 17, articuloNombre: 'Procesador Intel Core i5-12600K', cantidad: 1, precioUnitario: 180000, subtotal: 180000 }
    ],
    total: 180000,
    estado: 'Completada',
    metodoPago: 'Efectivo',
    vendedor: 'Alejandro Jiménez',
    observaciones: 'Armado de PC incluido'
  },
  {
    id: 15,
    fecha: '2024-01-29',
    cliente: 'Alejandro Jiménez',
    articulos: [
      { id: 15, articuloId: 16, articuloNombre: 'Laptop Dell Inspiron 15 3000', cantidad: 1, precioUnitario: 350000, subtotal: 350000 }
    ],
    total: 350000,
    estado: 'Pendiente',
    metodoPago: 'Tarjeta',
    vendedor: 'María González',
    observaciones: 'Garantía extendida incluida'
  }
];

class VentaService {
  private ventas: Venta[] = [...ventasMock];
  private nextId = 16;
  private nextArticuloId = 35;

  // Simular delay de red
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET /ventas - Obtener todas las ventas
  async findAll(): Promise<Venta[]> {
    await this.delay();
    return [...this.ventas].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  // GET /ventas/{id} - Obtener venta por ID
  async findById(id: number): Promise<Venta | null> {
    await this.delay();
    const venta = this.ventas.find(v => v.id === id);
    return venta ? { ...venta } : null;
  }

  // POST /ventas - Crear nueva venta
  async saveVenta(ventaData: Omit<Venta, 'id'>): Promise<Venta> {
    await this.delay();
    
    // Validaciones
    if (!ventaData.cliente || ventaData.cliente.trim() === '') {
      throw new Error('El cliente es obligatorio');
    }
    
    if (!ventaData.articulos || ventaData.articulos.length === 0) {
      throw new Error('La venta debe tener al menos un artículo');
    }

    if (ventaData.total <= 0) {
      throw new Error('El total debe ser mayor a 0');
    }

    // Asignar IDs a los artículos de la venta
    const articulosConId = ventaData.articulos.map(articulo => ({
      ...articulo,
      id: this.nextArticuloId++
    }));

    const nuevaVenta: Venta = {
      ...ventaData,
      id: this.nextId++,
      articulos: articulosConId,
      fecha: ventaData.fecha || new Date().toISOString().split('T')[0]
    };

    this.ventas.push(nuevaVenta);
    return { ...nuevaVenta };
  }

  // PUT /ventas/{id} - Actualizar venta existente
  async updateVenta(id: number, ventaData: Partial<Venta>): Promise<Venta> {
    await this.delay();
    
    const index = this.ventas.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error(`Venta con ID ${id} no encontrada`);
    }

    // Validaciones para actualización
    if (ventaData.cliente !== undefined && ventaData.cliente.trim() === '') {
      throw new Error('El cliente no puede estar vacío');
    }

    if (ventaData.articulos !== undefined && ventaData.articulos.length === 0) {
      throw new Error('La venta debe tener al menos un artículo');
    }

    if (ventaData.total !== undefined && ventaData.total <= 0) {
      throw new Error('El total debe ser mayor a 0');
    }

    // Actualizar la venta
    const ventaActualizada = {
      ...this.ventas[index],
      ...ventaData,
      id // Mantener el ID original
    };

    // Si se actualizan los artículos, asignar nuevos IDs
    if (ventaData.articulos) {
      ventaActualizada.articulos = ventaData.articulos.map(articulo => ({
        ...articulo,
        id: articulo.id || this.nextArticuloId++
      }));
    }

    this.ventas[index] = ventaActualizada;
    return { ...ventaActualizada };
  }

  // DELETE /ventas/{id} - Eliminar venta
  async deleteById(id: number): Promise<void> {
    await this.delay();
    
    const index = this.ventas.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error(`Venta con ID ${id} no encontrada`);
    }

    // Validar que la venta no esté completada (opcional)
    const venta = this.ventas[index];
    if (venta.estado === 'Completada') {
      throw new Error('No se puede eliminar una venta completada');
    }

    this.ventas.splice(index, 1);
  }

  // Métodos adicionales útiles

  // Obtener ventas por estado
  async getVentasByEstado(estado: Venta['estado']): Promise<Venta[]> {
    await this.delay();
    return this.ventas.filter(v => v.estado === estado);
  }

  // Obtener ventas por cliente
  async getVentasByCliente(cliente: string): Promise<Venta[]> {
    await this.delay();
    return this.ventas.filter(v => 
      v.cliente.toLowerCase().includes(cliente.toLowerCase())
    );
  }

  // Obtener ventas por fecha
  async getVentasByFecha(fechaInicio: string, fechaFin: string): Promise<Venta[]> {
    await this.delay();
    return this.ventas.filter(v => {
      const fechaVenta = new Date(v.fecha);
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      return fechaVenta >= inicio && fechaVenta <= fin;
    });
  }

  // Obtener estadísticas de ventas
  async getEstadisticas() {
    await this.delay();
    
    const total = this.ventas.length;
    const completadas = this.ventas.filter(v => v.estado === 'Completada').length;
    const pendientes = this.ventas.filter(v => v.estado === 'Pendiente').length;
    const canceladas = this.ventas.filter(v => v.estado === 'Cancelada').length;
    
    const totalVentas = this.ventas.reduce((sum, v) => sum + v.total, 0);
    const promedioVenta = total > 0 ? totalVentas / total : 0;
    
    const ventasHoy = this.ventas.filter(v => 
      v.fecha === new Date().toISOString().split('T')[0]
    ).length;

    return {
      total,
      completadas,
      pendientes,
      canceladas,
      totalVentas,
      promedioVenta,
      ventasHoy
    };
  }

  // Buscar ventas
  async searchVentas(query: string): Promise<Venta[]> {
    await this.delay();
    
    const queryLower = query.toLowerCase();
    return this.ventas.filter(v => 
      v.cliente.toLowerCase().includes(queryLower) ||
      v.id.toString().includes(query) ||
      v.articulos.some(a => a.articuloNombre.toLowerCase().includes(queryLower))
    );
  }

  // Obtener ventas por vendedor
  async getVentasByVendedor(vendedor: string): Promise<Venta[]> {
    await this.delay();
    return this.ventas.filter(v => 
      v.vendedor.toLowerCase().includes(vendedor.toLowerCase())
    );
  }

  // Obtener ventas por método de pago
  async getVentasByMetodoPago(metodoPago: Venta['metodoPago']): Promise<Venta[]> {
    await this.delay();
    return this.ventas.filter(v => v.metodoPago === metodoPago);
  }
}

// Exportar instancia singleton
const ventaService = new VentaService();
export default ventaService; 