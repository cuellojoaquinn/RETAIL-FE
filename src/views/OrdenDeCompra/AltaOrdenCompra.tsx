// 📁 src/views/OrdenDeCompra/AltaOrdenCompra.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdWarning, 
  MdSchedule, 
  MdShoppingCart, 
  MdCheckCircle, 
  MdCancel,
  MdPerson,
  MdInventory,
  MdDescription
} from 'react-icons/md';
import '../../styles/OrdenDeCompra.css';
import ordenCompraService from '../../services/ordenCompra.service.real';
import type { OrdenCompra } from '../../services/mocks/ordenCompra.service';

interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface Articulo {
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

interface OrdenCompraForm {
  proveedorId: number | null;
  articuloId: number | null;
  cantidad: number;
  precioUnitario: number;
  observaciones: string;
}

// Datos mockeados de proveedores
const proveedoresMock: Proveedor[] = [
  {
    id: 1,
    nombre: "Proveedor A - Logitech",
    email: "contacto@logitech.com",
    telefono: "+54 11 1234-5678",
    direccion: "Av. Corrientes 1234, CABA"
  },
  {
    id: 2,
    nombre: "Proveedor B - Corsair",
    email: "ventas@corsair.com",
    telefono: "+54 11 2345-6789",
    direccion: "Av. Santa Fe 567, CABA"
  },
  {
    id: 3,
    nombre: "Proveedor C - Samsung",
    email: "pedidos@samsung.com",
    telefono: "+54 11 3456-7890",
    direccion: "Av. Córdoba 890, CABA"
  },
  {
    id: 4,
    nombre: "Proveedor D - Sony",
    email: "compras@sony.com",
    telefono: "+54 11 4567-8901",
    direccion: "Av. Callao 123, CABA"
  },
  {
    id: 5,
    nombre: "Proveedor E - HP",
    email: "ventas@hp.com",
    telefono: "+54 11 5678-9012",
    direccion: "Av. 9 de Julio 456, CABA"
  }
];

// Datos mockeados de artículos
const articulosMock: Articulo[] = [
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
];

const AltaOrdenCompra = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState<Articulo[]>([]);
  const [mostrarModalArticulos, setMostrarModalArticulos] = useState(false);
  const [busquedaArticulos, setBusquedaArticulos] = useState('');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
  const [formulario, setFormulario] = useState<OrdenCompraForm>({
    proveedorId: null,
    articuloId: null,
    cantidad: 0,
    precioUnitario: 0,
    observaciones: ''
  });
  const [guardando, setGuardando] = useState(false);
  const [advertenciaPuntoPedido, setAdvertenciaPuntoPedido] = useState(false);

  // Estados del progreso
  const estados = [
    { nombre: 'Proveedor', activo: !!formulario.proveedorId, icono: <MdPerson /> },
    { nombre: 'Artículo', activo: !!articuloSeleccionado, icono: <MdInventory /> },
    { nombre: 'Detalles', activo: !!articuloSeleccionado && formulario.cantidad > 0, icono: <MdDescription /> }
  ];

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 300));
      setProveedores([...proveedoresMock]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando proveedores');
    } finally {
      setLoading(false);
    }
  };

  const cargarArticulosPorProveedor = async (proveedorId: number) => {
    try {
      setLoading(true);
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 200));
      const articulosProveedor = articulosMock.filter(a => a.proveedorId === proveedorId);
      setArticulos(articulosProveedor);
      setArticulosFiltrados(articulosProveedor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleProveedorChange = (proveedorId: number) => {
    setFormulario(prev => ({ ...prev, proveedorId }));
    setArticuloSeleccionado(null);
    setFormulario(prev => ({ ...prev, articuloId: null, cantidad: 0, precioUnitario: 0 }));
    cargarArticulosPorProveedor(proveedorId);
  };

  const handleBuscarArticulos = (termino: string) => {
    setBusquedaArticulos(termino);
    
    if (!termino.trim()) {
      setArticulosFiltrados(articulos);
      return;
    }

    const filtrados = articulos.filter(articulo =>
      articulo.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      articulo.codigo.toLowerCase().includes(termino.toLowerCase())
    );
    setArticulosFiltrados(filtrados);
  };

  const handleSeleccionarArticulo = (articulo: Articulo) => {
    setArticuloSeleccionado(articulo);
    setFormulario(prev => ({
      ...prev,
      articuloId: articulo.id,
      precioUnitario: articulo.precio,
      cantidad: 0
    }));
    setMostrarModalArticulos(false);
    setBusquedaArticulos('');
  };

  const handleCantidadChange = (cantidad: number) => {
    setFormulario(prev => ({
      ...prev,
      cantidad
    }));

    // Verificar punto de pedido
    if (articuloSeleccionado && cantidad > 0 && cantidad < articuloSeleccionado.puntoPedido) {
      setAdvertenciaPuntoPedido(true);
    } else {
      setAdvertenciaPuntoPedido(false);
    }
  };

  const calcularTotal = () => {
    const costoPedido = formulario.cantidad * formulario.precioUnitario;
    const costoOrden = 5000; // Costo fijo de la orden
    return costoPedido + costoOrden;
  };

  const validarFormulario = (): boolean => {
    const errores: string[] = [];

    if (!formulario.proveedorId) {
      errores.push('Debe seleccionar un proveedor');
    }

    if (!formulario.articuloId) {
      errores.push('Debe seleccionar un artículo');
    }

    if (formulario.cantidad <= 0) {
      errores.push('La cantidad debe ser mayor a 0');
    }

    if (formulario.precioUnitario <= 0) {
      errores.push('El precio unitario debe ser mayor a 0');
    }

    if (errores.length > 0) {
      setError(errores.join(', '));
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      setGuardando(true);
      setError(null);

      const nuevaOrden = await ordenCompraService.saveOrdenCompra({
        proveedor: proveedores.find(p => p.id === formulario.proveedorId)!,
        articulo: articulos.find(a => a.id === formulario.articuloId)!,
        cantidad: formulario.cantidad,
        precioUnitario: formulario.precioUnitario,
        total: formulario.cantidad * formulario.precioUnitario,
        estado: 'Pendiente',
        tiempoEntrega: formulario.tiempoEntrega,
        puntoPedido: formulario.puntoPedido,
        costoOrden: formulario.costoOrden,
        observaciones: formulario.observaciones
      });

      navigate('/ordenes-compra');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando la orden de compra');
    } finally {
      setGuardando(false);
    }
  };

  if (loading && proveedores.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Cargando proveedores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <MdWarning style={{ fontSize: '3rem', marginBottom: '1rem', color: '#dc3545' }} />
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          onClick={cargarProveedores}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="ordenes-compra-container">
      {/* Header */}
      <div className="ordenes-compra-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/ordenes-compra')}
            className="btn btn-secondary"
            style={{ marginRight: '1rem', padding: '0.5rem' }}
          >
            <MdArrowBack style={{ fontSize: '1.5rem' }} />
          </button>
          <h1 className="ordenes-compra-title">Crear orden de compra</h1>
        </div>
      </div>

      {/* Indicador de progreso */}
      <div className="progreso-container">
        {estados.map((estado, index) => (
          <React.Fragment key={estado.nombre}>
            <div className="progreso-paso">
              <div className={`progreso-circulo ${estado.activo ? 'activo' : 'inactivo'}`}>
                {estado.icono}
              </div>
              <span className={`progreso-label ${estado.activo ? 'activo' : 'inactivo'}`}>
                {estado.nombre}
              </span>
            </div>
            {index < estados.length - 1 && (
              <div className={`progreso-linea ${estado.activo ? 'activo' : 'inactivo'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Formulario */}
      <div className="formulario-container">
        {/* Sección: Proveedor */}
        <div className="formulario-seccion">
          <h3>
            <MdPerson />
            1. Proveedor
          </h3>
          
          {proveedores.length === 0 ? (
            <div className="alerta alerta-warning">
              <MdWarning style={{ fontSize: '3rem', marginBottom: '1rem' }} />
              <h4>No hay proveedores cargados</h4>
              <p>No hay proveedores cargados en el sistema. Por favor agregue un proveedor para continuar con esta operación.</p>
            </div>
          ) : (
            <div className="formulario-campo">
              <label className="formulario-label">Seleccione un proveedor</label>
              <select 
                value={formulario.proveedorId || ''}
                onChange={(e) => handleProveedorChange(Number(e.target.value))}
                className="formulario-select"
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Sección: Seleccionar Artículo */}
        {formulario.proveedorId && (
          <div className="formulario-seccion">
            <h3>
              <MdInventory />
              2. Seleccionar Artículo
            </h3>
            
            {articuloSeleccionado ? (
              <div className="alerta alerta-success">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{articuloSeleccionado.nombre}</h4>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                      Código: {articuloSeleccionado.codigo}
                    </p>
                    <p style={{ margin: '0', color: '#666' }}>
                      Precio: ${articuloSeleccionado.precio.toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => setMostrarModalArticulos(true)}
                    className="btn btn-secondary"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setMostrarModalArticulos(true)}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Cargando artículos...' : 'Seleccionar artículo'}
              </button>
            )}
          </div>
        )}

        {/* Sección: Formulario de Pedido */}
        {articuloSeleccionado && (
          <div className="formulario-seccion">
            <h3>
              <MdDescription />
              3. Formulario de Pedido
            </h3>
            
            <div style={{ 
              padding: '1.5rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div className="formulario-grid">
                <div className="formulario-campo">
                  <label className="formulario-label">Nombre del artículo</label>
                  <input 
                    type="text"
                    value={articuloSeleccionado.nombre}
                    readOnly
                    className="formulario-input"
                    style={{ backgroundColor: '#e9ecef' }}
                  />
                </div>
                <div className="formulario-campo">
                  <label className="formulario-label">Precio unitario</label>
                  <input 
                    type="number"
                    value={formulario.precioUnitario}
                    onChange={(e) => setFormulario(prev => ({ ...prev, precioUnitario: Number(e.target.value) }))}
                    className="formulario-input"
                  />
                </div>
              </div>

              <div className="formulario-campo">
                <label className="formulario-label">Cantidad</label>
                <input 
                  type="number"
                  value={formulario.cantidad}
                  onChange={(e) => handleCantidadChange(Number(e.target.value))}
                  className="formulario-input"
                />
                {advertenciaPuntoPedido && (
                  <div className="alerta alerta-warning" style={{ marginTop: '0.5rem' }}>
                    <strong>Advertencia:</strong> La cantidad es menor al punto de pedido ({articuloSeleccionado.puntoPedido} unidades).
                  </div>
                )}
              </div>

              <div className="formulario-campo">
                <label className="formulario-label">Observaciones</label>
                <textarea
                  value={formulario.observaciones}
                  onChange={(e) => setFormulario(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Agregue observaciones adicionales..."
                  rows={3}
                  className="formulario-textarea"
                />
              </div>

              <div className="alerta alerta-success">
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#155724' }}>Total de la orden de compra</h4>
                <p style={{ margin: '0', fontSize: '1.25rem', fontWeight: 'bold', color: '#155724' }}>
                  ${calcularTotal().toLocaleString()}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#155724' }}>
                  (Costo del pedido: ${(formulario.cantidad * formulario.precioUnitario).toLocaleString()} + 
                  Costo de la orden: $5,000)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botón de guardar */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button 
            onClick={() => navigate('/ordenes-compra')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button 
            onClick={handleGuardar}
            disabled={!validarFormulario() || guardando}
            className="btn btn-success"
          >
            {guardando ? 'Creando orden...' : 'Crear orden de compra'}
          </button>
        </div>
      </div>

      {/* Modal de selección de artículos */}
      {mostrarModalArticulos && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Seleccionar Artículo</h3>
              <button 
                onClick={() => setMostrarModalArticulos(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <div className="formulario-campo">
              <input 
                type="text"
                placeholder="Buscar artículos..."
                value={busquedaArticulos}
                onChange={(e) => handleBuscarArticulos(e.target.value)}
                className="formulario-input"
              />
            </div>

            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {articulosFiltrados.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6c757d' }}>
                  No se encontraron artículos
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {articulosFiltrados.map(articulo => (
                    <div 
                      key={articulo.id}
                      onClick={() => handleSeleccionarArticulo(articulo)}
                      style={{ 
                        padding: '1rem',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: articulo.esPredeterminado ? '#e3f2fd' : 'white',
                        borderLeft: articulo.esPredeterminado ? '4px solid #2196f3' : '1px solid #ced4da'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0' }}>
                            {articulo.nombre}
                            {articulo.esPredeterminado && (
                              <span style={{ 
                                marginLeft: '0.5rem',
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                borderRadius: '12px',
                                fontSize: '0.75rem'
                              }}>
                                Predeterminado
                              </span>
                            )}
                          </h4>
                          <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                            Código: {articulo.codigo}
                          </p>
                          <p style={{ margin: '0', color: '#666' }}>
                            {articulo.descripcion}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#28a745' }}>
                            ${articulo.precio.toLocaleString()}
                          </p>
                          <p style={{ margin: '0', fontSize: '0.875rem', color: '#666' }}>
                            Stock: {articulo.stock}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AltaOrdenCompra;