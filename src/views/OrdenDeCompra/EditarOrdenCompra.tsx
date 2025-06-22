// 📁 src/views/OrdenDeCompra/EditarOrdenCompra.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CampoTexto from '../../components/CampoText';
import { MdArrowBack, MdShoppingCart, MdWarning, MdCheckCircle, MdCancel, MdSend, MdRefresh, MdSchedule, MdEdit, MdPerson, MdInventory, MdDescription } from 'react-icons/md';
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

const EditarOrdenCompra = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordenCompra, setOrdenCompra] = useState<OrdenCompra | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState<Articulo[]>([]);
  const [mostrarModalArticulos, setMostrarModalArticulos] = useState(false);
  const [busquedaArticulos, setBusquedaArticulos] = useState('');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);
  const [formulario, setFormulario] = useState({
    cantidad: 0,
    precioUnitario: 0,
    observaciones: ''
  });
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [advertenciaPuntoPedido, setAdvertenciaPuntoPedido] = useState(false);

  // Estados del progreso
  const estados = [
    { nombre: 'Pendiente', activo: ordenCompra?.estado === 'Pendiente', icono: <MdSchedule /> },
    { nombre: 'Enviada', activo: ordenCompra?.estado === 'Enviada', icono: <MdShoppingCart /> },
    { nombre: 'Finalizada', activo: ordenCompra?.estado === 'Finalizada', icono: <MdCheckCircle /> },
    { nombre: 'Cancelada', activo: ordenCompra?.estado === 'Cancelada', icono: <MdCancel /> }
  ];

  useEffect(() => {
    const cargarOrden = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const orden = await ordenCompraService.findById(Number(id));
        
        if (!orden) {
          setError('Orden de compra no encontrada');
          return;
        }

        if (orden.estado !== 'Pendiente') {
          setError('Solo se pueden editar órdenes en estado Pendiente');
          return;
        }

        setOrdenCompra(orden);
        setFormulario({
          proveedorId: orden.proveedor.id,
          articuloId: orden.articulo.id,
          cantidad: orden.cantidad,
          precioUnitario: orden.precioUnitario,
          tiempoEntrega: orden.tiempoEntrega || 0,
          puntoPedido: orden.puntoPedido || 0,
          costoOrden: orden.costoOrden || 0,
          observaciones: orden.observaciones || ''
        });

        // Cargar artículos del proveedor
        const articulosProveedor = articulosMock.filter(a => a.proveedorId === orden.proveedor.id);
        setArticulos(articulosProveedor);
        setArticulosFiltrados(articulosProveedor);

        // Seleccionar el artículo actual
        const articuloActual = articulosProveedor.find(a => a.id === orden.articulo.id);
        if (articuloActual) {
          setArticuloSeleccionado(articuloActual);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando la orden de compra');
      } finally {
        setLoading(false);
      }
    };

    cargarOrden();
  }, [id]);

  const cargarProveedores = async () => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 300));
      setProveedores([...proveedoresMock]);
    } catch (err) {
      console.error('Error cargando proveedores:', err);
    }
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
    const costoOrden = ordenCompra?.costoOrden || 5000;
    return costoPedido + costoOrden;
  };

  const esFormularioValido = () => {
    return formulario.cantidad > 0 && formulario.precioUnitario > 0;
  };

  const handleGuardar = async () => {
    if (!esFormularioValido() || !ordenCompra) return;

    try {
      setGuardando(true);
      
      // Preparar datos para actualizar
      const datosActualizados = {
        cantidad: formulario.cantidad,
        precioUnitario: formulario.precioUnitario,
        observaciones: formulario.observaciones,
        total: calcularTotal()
      };
      
      await ordenCompraService.updateOrdenCompra(ordenCompra.id, datosActualizados);
      
      alert('Orden de compra actualizada exitosamente');
      navigate('/ordenes-compra');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando la orden de compra');
      console.error('Error actualizando orden de compra:', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarEstado = async () => {
    if (!ordenCompra) return;

    try {
      setCambiandoEstado(true);
      
      // Determinar el siguiente estado
      let nuevoEstado: OrdenCompra['estado'];
      switch (ordenCompra.estado) {
        case 'Pendiente':
          nuevoEstado = 'Enviada';
          break;
        case 'Enviada':
          nuevoEstado = 'Finalizada';
          break;
        default:
          nuevoEstado = ordenCompra.estado;
      }

      await ordenCompraService.cambiarEstado(ordenCompra.id, nuevoEstado);
      
      // Actualizar el estado local
      setOrdenCompra(prev => prev ? { ...prev, estado: nuevoEstado } : null);
      
      alert(`Estado cambiado a: ${nuevoEstado}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cambiando el estado');
      console.error('Error cambiando estado:', err);
    } finally {
      setCambiandoEstado(false);
    }
  };

  const obtenerSiguienteEstado = () => {
    if (!ordenCompra) return null;
    
    switch (ordenCompra.estado) {
      case 'Pendiente':
        return 'Enviada';
      case 'Enviada':
        return 'Finalizada';
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Cargando orden de compra...</p>
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
          onClick={() => navigate('/ordenes-compra')}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Volver
        </button>
      </div>
    );
  }

  if (!ordenCompra) {
    return (
      <div className="loading-container">
        <MdWarning style={{ fontSize: '3rem', marginBottom: '1rem', color: '#dc3545' }} />
        <h3>Orden no encontrada</h3>
        <p>La orden de compra solicitada no existe.</p>
        <button 
          onClick={() => navigate('/ordenes-compra')}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Volver
        </button>
      </div>
    );
  }

  const siguienteEstado = obtenerSiguienteEstado();
  const camposDeshabilitados = ordenCompra.estado !== 'Pendiente';

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
          <h1 className="ordenes-compra-title">Editar orden de compra</h1>
        </div>
        <div className="ordenes-compra-actions">
          <button 
            onClick={handleCambiarEstado}
            disabled={cambiandoEstado || !obtenerSiguienteEstado()}
            className="btn btn-primary"
          >
            <MdEdit />
            {cambiandoEstado ? 'Cambiando estado...' : `Cambiar a ${obtenerSiguienteEstado() || 'Finalizado'}`}
          </button>
        </div>
      </div>

      {/* Información de la orden */}
      <div className="formulario-container">
        <div className="formulario-seccion">
          <h3>
            <MdPerson />
            Información de la orden
          </h3>
          
          <div className="formulario-grid">
            <div className="formulario-campo">
              <label className="formulario-label">Número de orden</label>
              <input 
                type="text"
                value={ordenCompra.numero}
                readOnly
                className="formulario-input"
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
            <div className="formulario-campo">
              <label className="formulario-label">Fecha de creación</label>
              <input 
                type="text"
                value={new Date(ordenCompra.fechaCreacion).toLocaleDateString('es-ES')}
                readOnly
                className="formulario-input"
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
          </div>

          <div className="formulario-campo">
            <label className="formulario-label">Proveedor</label>
            <input 
              type="text"
              value={ordenCompra.proveedor.nombre}
              readOnly
              className="formulario-input"
              style={{ backgroundColor: '#e9ecef' }}
            />
          </div>

          <div className="formulario-campo">
            <label className="formulario-label">Estado actual</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`estado-badge estado-${ordenCompra.estado.toLowerCase()}`}>
                {ordenCompra.estado}
              </span>
              {ordenCompra.estado !== 'Pendiente' && (
                <div className="alerta alerta-warning">
                  <MdWarning style={{ marginRight: '0.5rem' }} />
                  Solo se pueden editar órdenes en estado Pendiente
                </div>
              )}
            </div>
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

        {/* Formulario de edición */}
        {ordenCompra.estado === 'Pendiente' && (
          <>
            <div className="formulario-seccion">
              <h3>
                <MdInventory />
                Cambiar artículo
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
                  className="btn btn-primary"
                >
                  Seleccionar artículo
                </button>
              )}
            </div>

            <div className="formulario-seccion">
              <h3>
                <MdDescription />
                Modificar pedido
              </h3>
              
              <div style={{ 
                padding: '1.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div className="formulario-grid">
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
                        <strong>Advertencia:</strong> La cantidad es menor al punto de pedido ({articuloSeleccionado?.puntoPedido} unidades).
                      </div>
                    )}
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
                    Costo de la orden: ${ordenCompra.costoOrden.toLocaleString()})
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => navigate('/ordenes-compra')}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={handleGuardar}
                disabled={!esFormularioValido() || guardando}
                className="btn btn-success"
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </>
        )}
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

export default EditarOrdenCompra;
