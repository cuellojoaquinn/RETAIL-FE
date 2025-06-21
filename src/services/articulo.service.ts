// 📁 src/services/articulo.service.ts
// Mock del servicio de artículos basado en el controlador Java

export interface Articulo {
  id: number;
  codigo: string;
  nombre: string;
  estado: 'Activo' | 'Inactivo';
  proveedor: string;
  precio: string;
  inventario: number;
  stockSeguridad: number;
  tipoModelo: string;
  proveedorPredeterminadoId?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// Datos mockeados de artículos
const articulosMock: Articulo[] = [
  {
    id: 1,
    codigo: "A001",
    nombre: "Mouse Logitech G502 HERO",
    estado: "Activo",
    proveedor: "Proveedor A - Logitech",
    precio: "$1500",
    inventario: 50,
    stockSeguridad: 10,
    tipoModelo: "Periférico",
    proveedorPredeterminadoId: 1
  },
  {
    id: 2,
    codigo: "A002",
    nombre: "Teclado Mecánico Corsair K70",
    estado: "Activo",
    proveedor: "Proveedor B - Corsair",
    precio: "$3000",
    inventario: 0,
    stockSeguridad: 5,
    tipoModelo: "Periférico",
    proveedorPredeterminadoId: 2
  },
  {
    id: 3,
    codigo: "A003",
    nombre: "Monitor LED 24\" Samsung FHD",
    estado: "Activo",
    proveedor: "Proveedor C - Samsung",
    precio: "$25000",
    inventario: 15,
    stockSeguridad: 3,
    tipoModelo: "Monitor",
    proveedorPredeterminadoId: 3
  },
  {
    id: 4,
    codigo: "A004",
    nombre: "Auriculares Bluetooth Sony WH-1000XM4",
    estado: "Inactivo",
    proveedor: "Proveedor D - Sony",
    precio: "$8000",
    inventario: 0,
    stockSeguridad: 8,
    tipoModelo: "Audio",
    proveedorPredeterminadoId: 4
  },
  {
    id: 5,
    codigo: "A005",
    nombre: "Webcam HD Logitech C920",
    estado: "Activo",
    proveedor: "Proveedor A - Logitech",
    precio: "$12000",
    inventario: 8,
    stockSeguridad: 5,
    tipoModelo: "Video",
    proveedorPredeterminadoId: 1
  },
  {
    id: 6,
    codigo: "A006",
    nombre: "SSD 1TB Samsung 970 EVO Plus",
    estado: "Activo",
    proveedor: "Proveedor C - Samsung",
    precio: "$9000",
    inventario: 25,
    stockSeguridad: 8,
    tipoModelo: "Almacenamiento",
    proveedorPredeterminadoId: 3
  },
  {
    id: 7,
    codigo: "A007",
    nombre: "Memoria RAM 16GB Kingston Fury",
    estado: "Activo",
    proveedor: "Proveedor F - Kingston",
    precio: "$12000",
    inventario: 40,
    stockSeguridad: 12,
    tipoModelo: "Memoria",
    proveedorPredeterminadoId: 6
  },
  {
    id: 8,
    codigo: "A008",
    nombre: "Impresora Láser HP LaserJet Pro",
    estado: "Activo",
    proveedor: "Proveedor E - HP",
    precio: "$90000",
    inventario: 3,
    stockSeguridad: 2,
    tipoModelo: "Impresora",
    proveedorPredeterminadoId: 5
  },
  {
    id: 9,
    codigo: "A009",
    nombre: "Fuente de Poder 750W EVGA",
    estado: "Activo",
    proveedor: "Proveedor G - EVGA",
    precio: "$13500",
    inventario: 12,
    stockSeguridad: 4,
    tipoModelo: "Componente",
    proveedorPredeterminadoId: 7
  },
  {
    id: 10,
    codigo: "A010",
    nombre: "Placa de Video RTX 4060 MSI",
    estado: "Activo",
    proveedor: "Proveedor H - MSI",
    precio: "$400000",
    inventario: 2,
    stockSeguridad: 1,
    tipoModelo: "Componente",
    proveedorPredeterminadoId: 8
  },
  {
    id: 11,
    codigo: "A011",
    nombre: "Disco Duro 2TB Seagate Barracuda",
    estado: "Activo",
    proveedor: "Proveedor I - Seagate",
    precio: "$7500",
    inventario: 18,
    stockSeguridad: 6,
    tipoModelo: "Almacenamiento",
    proveedorPredeterminadoId: 9
  },
  {
    id: 12,
    codigo: "A012",
    nombre: "Router WiFi TP-Link Archer C7",
    estado: "Activo",
    proveedor: "Proveedor J - TP-Link",
    precio: "$15000",
    inventario: 6,
    stockSeguridad: 3,
    tipoModelo: "Red",
    proveedorPredeterminadoId: 10
  },
  {
    id: 13,
    codigo: "A013",
    nombre: "Micrófono USB Blue Yeti",
    estado: "Activo",
    proveedor: "Proveedor K - Blue Microphones",
    precio: "$25000",
    inventario: 4,
    stockSeguridad: 2,
    tipoModelo: "Audio",
    proveedorPredeterminadoId: 11
  },
  {
    id: 14,
    codigo: "A014",
    nombre: "Tablet Samsung Galaxy Tab S7",
    estado: "Activo",
    proveedor: "Proveedor C - Samsung",
    precio: "$180000",
    inventario: 7,
    stockSeguridad: 3,
    tipoModelo: "Tablet",
    proveedorPredeterminadoId: 3
  },
  {
    id: 15,
    codigo: "A015",
    nombre: "Cable HDMI 2.0 2m Premium",
    estado: "Activo",
    proveedor: "Proveedor N - Generic",
    precio: "$800",
    inventario: 100,
    stockSeguridad: 20,
    tipoModelo: "Cable",
    proveedorPredeterminadoId: 14
  },
  {
    id: 16,
    codigo: "A016",
    nombre: "Laptop Dell Inspiron 15 3000",
    estado: "Activo",
    proveedor: "Proveedor L - Dell",
    precio: "$350000",
    inventario: 5,
    stockSeguridad: 2,
    tipoModelo: "Laptop",
    proveedorPredeterminadoId: 12
  },
  {
    id: 17,
    codigo: "A017",
    nombre: "Mouse Pad Gaming RGB",
    estado: "Inactivo",
    proveedor: "Proveedor P - Generic",
    precio: "$2500",
    inventario: 0,
    stockSeguridad: 15,
    tipoModelo: "Accesorio"
  },
  {
    id: 18,
    codigo: "A018",
    nombre: "Teclado Numérico USB",
    estado: "Activo",
    proveedor: "Proveedor Q - Generic",
    precio: "$1800",
    inventario: 22,
    stockSeguridad: 8,
    tipoModelo: "Periférico",
    proveedorPredeterminadoId: 15
  },
  {
    id: 19,
    codigo: "A019",
    nombre: "Monitor 27\" 4K LG UltraFine",
    estado: "Activo",
    proveedor: "Proveedor M - LG",
    precio: "$450000",
    inventario: 1,
    stockSeguridad: 1,
    tipoModelo: "Monitor",
    proveedorPredeterminadoId: 13
  },
  {
    id: 20,
    codigo: "A020",
    nombre: "Auriculares Gaming Razer Kraken",
    estado: "Activo",
    proveedor: "Proveedor N - Razer",
    precio: "$18000",
    inventario: 9,
    stockSeguridad: 4,
    tipoModelo: "Audio",
    proveedorPredeterminadoId: 14
  }
];

class ArticuloService {
  private articulos: Articulo[] = [...articulosMock];
  private nextId = 21;

  // Simular delay de red
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET /articulos - Obtener todos los artículos con paginación
  async findAll(page: number = 0, size: number = 10): Promise<Page<Articulo>> {
    await this.delay();
    
    const start = page * size;
    const end = start + size;
    const content = this.articulos.slice(start, end);
    const totalElements = this.articulos.length;
    const totalPages = Math.ceil(totalElements / size);

    return {
      content,
      totalElements,
      totalPages,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
      numberOfElements: content.length
    };
  }

  // GET /articulos/{id} - Obtener artículo por ID
  async findById(id: number): Promise<Articulo | null> {
    await this.delay();
    
    const articulo = this.articulos.find(a => a.id === id);
    if (!articulo) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }
    
    return articulo;
  }

  // POST /articulos - Crear nuevo artículo
  async saveArticulo(articulo: Omit<Articulo, 'id'>): Promise<Articulo> {
    await this.delay();
    
    // Validaciones básicas
    if (!articulo.codigo || !articulo.nombre) {
      throw new Error('Código y nombre son obligatorios');
    }

    // Verificar que el código no exista
    if (this.articulos.some(a => a.codigo === articulo.codigo)) {
      throw new Error(`Ya existe un artículo con el código ${articulo.codigo}`);
    }

    const newArticulo: Articulo = {
      ...articulo,
      id: this.nextId++
    };

    this.articulos.push(newArticulo);
    return newArticulo;
  }

  // PUT /articulos/{id} - Actualizar artículo
  async updateArticulo(id: number, articuloData: Partial<Articulo>): Promise<Articulo> {
    await this.delay();
    
    const index = this.articulos.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }

    // Verificar que el código no exista en otro artículo
    if (articuloData.codigo && 
        this.articulos.some(a => a.codigo === articuloData.codigo && a.id !== id)) {
      throw new Error(`Ya existe un artículo con el código ${articuloData.codigo}`);
    }

    const updatedArticulo = {
      ...this.articulos[index],
      ...articuloData,
      id // Mantener el ID original
    };

    this.articulos[index] = updatedArticulo;
    return updatedArticulo;
  }

  // DELETE /articulos/{id} - Eliminar artículo
  async deleteById(id: number): Promise<void> {
    await this.delay();
    
    const index = this.articulos.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }

    // Verificar si el artículo tiene inventario
    const articulo = this.articulos[index];
    if (articulo.inventario > 0) {
      throw new Error(`No se puede eliminar el artículo ${articulo.nombre} porque tiene ${articulo.inventario} unidades en inventario`);
    }

    this.articulos.splice(index, 1);
  }

  // PUT /articulos/{id}/proveedor-predeterminado - Establecer proveedor predeterminado
  async setProveedorPredeterminado(id: number, proveedorId?: number): Promise<Articulo> {
    await this.delay();
    
    const articulo = await this.findById(id);
    if (!articulo) {
      throw new Error(`Artículo con ID ${id} no encontrado`);
    }

    const updatedArticulo = {
      ...articulo,
      proveedorPredeterminadoId: proveedorId || undefined
    };

    const index = this.articulos.findIndex(a => a.id === id);
    this.articulos[index] = updatedArticulo;
    
    return updatedArticulo;
  }

  // GET /articulos/a-reponer - Obtener artículos que necesitan reposición
  async getArticulosAReponer(): Promise<Articulo[]> {
    await this.delay();
    
    return this.articulos.filter(articulo => 
      articulo.estado === 'Activo' && 
      articulo.inventario <= articulo.stockSeguridad &&
      articulo.inventario > 0
    );
  }

  // GET /articulos/faltantes - Obtener artículos sin stock
  async getArticulosFaltantes(): Promise<Articulo[]> {
    await this.delay();
    
    return this.articulos.filter(articulo => 
      articulo.estado === 'Activo' && 
      articulo.inventario === 0
    );
  }

  // Métodos adicionales útiles para el frontend

  // Buscar artículos por nombre o código
  async searchArticulos(query: string): Promise<Articulo[]> {
    await this.delay();
    
    const searchTerm = query.toLowerCase();
    return this.articulos.filter(articulo =>
      articulo.nombre.toLowerCase().includes(searchTerm) ||
      articulo.codigo.toLowerCase().includes(searchTerm) ||
      articulo.proveedor.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrar artículos por estado
  async getArticulosByEstado(estado: 'Activo' | 'Inactivo'): Promise<Articulo[]> {
    await this.delay();
    
    return this.articulos.filter(articulo => articulo.estado === estado);
  }

  // Filtrar artículos por tipo de modelo
  async getArticulosByTipoModelo(tipoModelo: string): Promise<Articulo[]> {
    await this.delay();
    
    return this.articulos.filter(articulo => articulo.tipoModelo === tipoModelo);
  }

  // Obtener estadísticas básicas
  async getEstadisticas() {
    await this.delay();
    
    const total = this.articulos.length;
    const activos = this.articulos.filter(a => a.estado === 'Activo').length;
    const inactivos = total - activos;
    const sinStock = this.articulos.filter(a => a.inventario === 0).length;
    const aReponer = this.articulos.filter(a => 
      a.estado === 'Activo' && 
      a.inventario <= a.stockSeguridad &&
      a.inventario > 0
    ).length;

    return {
      total,
      activos,
      inactivos,
      sinStock,
      aReponer
    };
  }
}

// Exportar instancia singleton
export const articuloService = new ArticuloService();
export default articuloService; 