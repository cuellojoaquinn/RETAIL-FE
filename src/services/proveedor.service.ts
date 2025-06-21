// Servicio mock para proveedores
// Basado en el controlador Java: ProveedorController

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

// Datos mockeados de proveedores
const proveedoresMock: Proveedor[] = [
  {
    id: 1,
    nombre: "Proveedor A - Logitech",
    email: "contacto@logitech.com",
    telefono: "+54 11 1234-5678",
    direccion: "Av. Corrientes 1234, CABA",
    cuit: "30-12345678-9",
    contacto: "Juan Pérez",
    activo: true,
    fechaAlta: "2024-01-15",
    observaciones: "Proveedor principal de periféricos gaming"
  },
  {
    id: 2,
    nombre: "Proveedor B - Corsair",
    email: "ventas@corsair.com",
    telefono: "+54 11 2345-6789",
    direccion: "Av. Santa Fe 567, CABA",
    cuit: "30-23456789-0",
    contacto: "María González",
    activo: true,
    fechaAlta: "2024-01-16",
    observaciones: "Especialista en teclados mecánicos"
  },
  {
    id: 3,
    nombre: "Proveedor C - Samsung",
    email: "pedidos@samsung.com",
    telefono: "+54 11 3456-7890",
    direccion: "Av. Córdoba 890, CABA",
    cuit: "30-34567890-1",
    contacto: "Carlos Rodríguez",
    activo: true,
    fechaAlta: "2024-01-17",
    observaciones: "Proveedor de monitores y almacenamiento"
  },
  {
    id: 4,
    nombre: "Proveedor D - Sony",
    email: "compras@sony.com",
    telefono: "+54 11 4567-8901",
    direccion: "Av. Callao 123, CABA",
    cuit: "30-45678901-2",
    contacto: "Ana López",
    activo: true,
    fechaAlta: "2024-01-18",
    observaciones: "Audio y accesorios premium"
  },
  {
    id: 5,
    nombre: "Proveedor E - HP",
    email: "ventas@hp.com",
    telefono: "+54 11 5678-9012",
    direccion: "Av. 9 de Julio 456, CABA",
    cuit: "30-56789012-3",
    contacto: "Roberto Silva",
    activo: false,
    fechaAlta: "2024-01-19",
    observaciones: "Impresoras y equipos de oficina"
  },
  {
    id: 6,
    nombre: "Proveedor F - Kingston",
    email: "ventas@kingston.com",
    telefono: "+54 11 6789-0123",
    direccion: "Av. Libertador 789, CABA",
    cuit: "30-67890123-4",
    contacto: "Laura Martínez",
    activo: true,
    fechaAlta: "2024-01-20",
    observaciones: "Memorias RAM y almacenamiento"
  },
  {
    id: 7,
    nombre: "Proveedor G - Razer",
    email: "contacto@razer.com",
    telefono: "+54 11 7890-1234",
    direccion: "Av. Belgrano 321, CABA",
    cuit: "30-78901234-5",
    contacto: "Diego Fernández",
    activo: true,
    fechaAlta: "2024-01-21",
    observaciones: "Periféricos gaming premium"
  }
];

// Datos mockeados de artículos por proveedor
const articulosPorProveedorMock: Record<number, ArticuloProveedor[]> = {
  1: [ // Logitech
    {
      id: 1,
      codigo: "A001",
      nombre: "Mouse Logitech G502 HERO",
      descripcion: "Mouse gaming con sensor HERO 25K",
      precio: 1500,
      stock: 15,
      puntoPedido: 20,
      proveedorId: 1,
      esPredeterminado: true
    },
    {
      id: 5,
      codigo: "A005",
      nombre: "Webcam HD Logitech C920",
      descripcion: "Webcam HD 1080p con micrófono integrado",
      precio: 1200,
      stock: 20,
      puntoPedido: 25,
      proveedorId: 1,
      esPredeterminado: false
    },
    {
      id: 9,
      codigo: "A009",
      nombre: "Teclado Logitech G Pro X",
      descripcion: "Teclado mecánico gaming con switches intercambiables",
      precio: 4500,
      stock: 8,
      puntoPedido: 12,
      proveedorId: 1,
      esPredeterminado: false
    }
  ],
  2: [ // Corsair
    {
      id: 2,
      codigo: "A002",
      nombre: "Teclado Mecánico Corsair K70",
      descripcion: "Teclado mecánico RGB con switches Cherry MX",
      precio: 3000,
      stock: 8,
      puntoPedido: 15,
      proveedorId: 2,
      esPredeterminado: true
    },
    {
      id: 7,
      codigo: "A007",
      nombre: "Memoria RAM 16GB Kingston Fury",
      descripcion: "Memoria RAM DDR4 16GB 3200MHz",
      precio: 6000,
      stock: 15,
      puntoPedido: 12,
      proveedorId: 2,
      esPredeterminado: false
    },
    {
      id: 10,
      codigo: "A010",
      nombre: "Mouse Corsair M65 RGB Elite",
      descripcion: "Mouse gaming con sensor óptico de 18.000 DPI",
      precio: 2800,
      stock: 12,
      puntoPedido: 18,
      proveedorId: 2,
      esPredeterminado: false
    }
  ],
  3: [ // Samsung
    {
      id: 3,
      codigo: "A003",
      nombre: "Monitor LED 24\" Samsung FHD",
      descripcion: "Monitor LED 24 pulgadas Full HD",
      precio: 25000,
      stock: 5,
      puntoPedido: 5,
      proveedorId: 3,
      esPredeterminado: false
    },
    {
      id: 6,
      codigo: "A006",
      nombre: "SSD 1TB Samsung 870 EVO",
      descripcion: "Disco sólido interno 1TB SATA III",
      precio: 9000,
      stock: 10,
      puntoPedido: 8,
      proveedorId: 3,
      esPredeterminado: false
    },
    {
      id: 11,
      codigo: "A011",
      nombre: "Monitor 27\" Samsung Odyssey G5",
      descripcion: "Monitor gaming curvo 144Hz 1ms",
      precio: 45000,
      stock: 3,
      puntoPedido: 3,
      proveedorId: 3,
      esPredeterminado: false
    }
  ],
  4: [ // Sony
    {
      id: 4,
      codigo: "A004",
      nombre: "Auriculares Bluetooth Sony WH-1000XM4",
      descripcion: "Auriculares inalámbricos con cancelación de ruido",
      precio: 8000,
      stock: 12,
      puntoPedido: 10,
      proveedorId: 4,
      esPredeterminado: false
    },
    {
      id: 12,
      codigo: "A012",
      nombre: "Cámara Sony Alpha A7 III",
      descripcion: "Cámara mirrorless full frame 24.2MP",
      precio: 150000,
      stock: 2,
      puntoPedido: 1,
      proveedorId: 4,
      esPredeterminado: false
    }
  ],
  5: [ // HP
    {
      id: 8,
      codigo: "A008",
      nombre: "Impresora Láser HP LaserJet Pro",
      descripcion: "Impresora láser monocromática A4",
      precio: 90000,
      stock: 2,
      puntoPedido: 2,
      proveedorId: 5,
      esPredeterminado: false
    }
  ],
  6: [ // Kingston
    {
      id: 13,
      codigo: "A013",
      nombre: "SSD 500GB Kingston A2000",
      descripcion: "Disco sólido NVMe 500GB PCIe 3.0",
      precio: 5000,
      stock: 18,
      puntoPedido: 15,
      proveedorId: 6,
      esPredeterminado: false
    },
    {
      id: 14,
      codigo: "A014",
      nombre: "Memoria RAM 32GB Kingston Fury",
      descripcion: "Memoria RAM DDR4 32GB 3600MHz",
      precio: 12000,
      stock: 6,
      puntoPedido: 5,
      proveedorId: 6,
      esPredeterminado: false
    }
  ],
  7: [ // Razer
    {
      id: 15,
      codigo: "A015",
      nombre: "Mouse Razer DeathAdder V3 Pro",
      descripcion: "Mouse gaming inalámbrico 30K DPI",
      precio: 3500,
      stock: 10,
      puntoPedido: 8,
      proveedorId: 7,
      esPredeterminado: false
    },
    {
      id: 16,
      codigo: "A016",
      nombre: "Teclado Razer BlackWidow V3 Pro",
      descripcion: "Teclado mecánico gaming inalámbrico",
      precio: 5500,
      stock: 5,
      puntoPedido: 4,
      proveedorId: 7,
      esPredeterminado: false
    }
  ]
};

class ProveedorService {
  // GET /proveedores - Obtener todos los proveedores
  async findAll(): Promise<Proveedor[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular respuesta exitosa
    return [...proveedoresMock];
  }

  // GET /proveedores/{id} - Obtener proveedor por ID
  async findById(id: number): Promise<Proveedor> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const proveedor = proveedoresMock.find(p => p.id === id);
    if (!proveedor) {
      throw new Error(`Proveedor con ID ${id} no encontrado`);
    }
    
    return proveedor;
  }

  // POST /proveedores - Crear nuevo proveedor
  async saveProveedor(proveedor: Omit<Proveedor, 'id' | 'fechaAlta'>): Promise<Proveedor> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validar que el email no esté duplicado
    const emailExiste = proveedoresMock.some(p => p.email.toLowerCase() === proveedor.email.toLowerCase());
    if (emailExiste) {
      throw new Error('Ya existe un proveedor con ese email');
    }

    // Validar que el CUIT no esté duplicado
    const cuitExiste = proveedoresMock.some(p => p.cuit === proveedor.cuit);
    if (cuitExiste) {
      throw new Error('Ya existe un proveedor con ese CUIT');
    }
    
    // Generar ID y fecha de alta
    const nuevoId = Math.max(...proveedoresMock.map(p => p.id)) + 1;
    const fechaActual = new Date().toISOString().split('T')[0];
    
    const nuevoProveedor: Proveedor = {
      ...proveedor,
      id: nuevoId,
      fechaAlta: fechaActual
    };
    
    // Agregar a la lista mock
    proveedoresMock.push(nuevoProveedor);
    
    return nuevoProveedor;
  }

  // PUT /proveedores/{id} - Actualizar proveedor existente
  async updateProveedor(id: number, proveedor: Partial<Proveedor>): Promise<Proveedor> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = proveedoresMock.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Proveedor con ID ${id} no encontrado`);
    }
    
    // Validar email único si se está actualizando
    if (proveedor.email) {
      const emailExiste = proveedoresMock.some(p => 
        p.id !== id && p.email.toLowerCase() === proveedor.email!.toLowerCase()
      );
      if (emailExiste) {
        throw new Error('Ya existe un proveedor con ese email');
      }
    }

    // Validar CUIT único si se está actualizando
    if (proveedor.cuit) {
      const cuitExiste = proveedoresMock.some(p => 
        p.id !== id && p.cuit === proveedor.cuit
      );
      if (cuitExiste) {
        throw new Error('Ya existe un proveedor con ese CUIT');
      }
    }
    
    // Actualizar el proveedor
    const proveedorActualizado = {
      ...proveedoresMock[index],
      ...proveedor,
      id // Mantener el ID original
    };
    
    proveedoresMock[index] = proveedorActualizado;
    
    return proveedorActualizado;
  }

  // DELETE /proveedores/{id} - Eliminar proveedor
  async deleteById(id: number): Promise<void> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = proveedoresMock.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Proveedor con ID ${id} no encontrado`);
    }
    
    // Verificar que el proveedor esté inactivo antes de eliminar
    if (proveedoresMock[index].activo) {
      throw new Error('Solo se pueden eliminar proveedores inactivos');
    }
    
    // Verificar que no tenga artículos asociados
    const tieneArticulos = articulosPorProveedorMock[id] && articulosPorProveedorMock[id].length > 0;
    if (tieneArticulos) {
      throw new Error('No se puede eliminar un proveedor que tiene artículos asociados');
    }
    
    // Eliminar de la lista
    proveedoresMock.splice(index, 1);
  }

  // GET /proveedores/{proveedorId}/articulos - Obtener artículos por proveedor
  async getArticulosPorProveedor(proveedorId: number): Promise<Map<string, any>[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verificar que el proveedor existe
    const proveedor = proveedoresMock.find(p => p.id === proveedorId);
    if (!proveedor) {
      throw new Error(`Proveedor con ID ${proveedorId} no encontrado`);
    }
    
    const articulos = articulosPorProveedorMock[proveedorId] || [];
    
    // Convertir a formato Map<string, Object> como espera el backend
    return articulos.map(articulo => ({
      id: articulo.id,
      codigo: articulo.codigo,
      nombre: articulo.nombre,
      descripcion: articulo.descripcion,
      precio: articulo.precio,
      stock: articulo.stock,
      puntoPedido: articulo.puntoPedido,
      esPredeterminado: articulo.esPredeterminado,
      proveedor: {
        id: proveedor.id,
        nombre: proveedor.nombre,
        email: proveedor.email
      }
    }));
  }

  // Métodos adicionales útiles para el frontend

  // Obtener proveedores activos
  async findActivos(): Promise<Proveedor[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return proveedoresMock.filter(p => p.activo);
  }

  // Obtener proveedores inactivos
  async findInactivos(): Promise<Proveedor[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return proveedoresMock.filter(p => !p.activo);
  }

  // Buscar proveedores por nombre, email o contacto
  async searchProveedores(termino: string): Promise<Proveedor[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const terminoLower = termino.toLowerCase();
    return proveedoresMock.filter(proveedor => 
      proveedor.nombre.toLowerCase().includes(terminoLower) ||
      proveedor.email.toLowerCase().includes(terminoLower) ||
      proveedor.contacto.toLowerCase().includes(terminoLower) ||
      proveedor.cuit.includes(termino)
    );
  }

  // Obtener estadísticas
  async getEstadisticas() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const total = proveedoresMock.length;
    const activos = proveedoresMock.filter(p => p.activo).length;
    const inactivos = proveedoresMock.filter(p => !p.activo).length;
    const conArticulos = proveedoresMock.filter(p => 
      articulosPorProveedorMock[p.id] && articulosPorProveedorMock[p.id].length > 0
    ).length;

    return {
      total,
      activos,
      inactivos,
      conArticulos
    };
  }

  // Cambiar estado activo/inactivo
  async cambiarEstado(id: number, activo: boolean): Promise<Proveedor> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = proveedoresMock.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Proveedor con ID ${id} no encontrado`);
    }
    
    proveedoresMock[index].activo = activo;
    
    return proveedoresMock[index];
  }

  // Obtener proveedores con artículos predeterminados
  async findConArticulosPredeterminados(): Promise<Proveedor[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return proveedoresMock.filter(proveedor => 
      articulosPorProveedorMock[proveedor.id]?.some(articulo => articulo.esPredeterminado)
    );
  }
}

// Exportar instancia única del servicio
const proveedorService = new ProveedorService();
export default proveedorService; 