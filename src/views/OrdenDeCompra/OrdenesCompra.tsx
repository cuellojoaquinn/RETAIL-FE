// 📁 src/views/OrdenDeCompra/OrdenesCompra.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdShoppingCart, MdWarning, MdDelete, MdAdd } from 'react-icons/md';
import Buscador from '../../components/Buscador';
import FiltrosRapidos from '../../components/FiltrosRapidos';
import TablaGenerica from '../../components/TablaGenerica';
import ordenCompraService from '../../services/ordenCompra.service';
import type { OrdenCompra } from '../../services/ordenCompra.service';
import '../../styles/OrdenDeCompra.css';

const OrdenesCompra = () => {
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [ordenAEliminar, setOrdenAEliminar] = useState<OrdenCompra | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pendientes: 0,
    enviadas: 0,
    finalizadas: 0,
    canceladas: 0,
    totalValor: 0
  });

  const navigate = useNavigate();

  // Cargar órdenes de compra al montar el componente
  useEffect(() => {
    cargarOrdenesCompra();
    cargarEstadisticas();
  }, []);

  const cargarOrdenesCompra = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ordenes = await ordenCompraService.findAll();
      setOrdenesCompra(ordenes);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando órdenes de compra');
      console.error('Error cargando órdenes de compra:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const stats = await ordenCompraService.getEstadisticas();
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  // Buscar órdenes de compra
  const handleBuscar = async (termino: string) => {
    setBusqueda(termino);
    
    if (!termino.trim()) {
      cargarOrdenesCompra();
      return;
    }

    try {
      setLoading(true);
      const resultados = await ordenCompraService.searchOrdenes(termino);
      setOrdenesCompra(resultados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  // Manejar filtros rápidos
  const handleFiltroRapido = async (filtro: string) => {
    setFiltroEstado(filtro);
    
    try {
      setLoading(true);
      setError(null);
      
      if (filtro === "Todos") {
        await cargarOrdenesCompra();
      } else {
        const ordenes = await ordenCompraService.findByEstado(filtro as OrdenCompra['estado']);
        setOrdenesCompra(ordenes);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error aplicando filtro');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = () => {
    console.log('Navegando a alta de orden de compra');
    navigate('/ordenes-compra/alta');
  };

  const handleEditar = (orden: OrdenCompra) => {
    console.log('Intentando editar orden:', orden);
    if (orden.estado === 'Pendiente') {
      console.log('Navegando a editar orden:', orden.id);
      navigate(`/ordenes-compra/editar/${orden.id}`);
    } else {
      console.log('Orden no editable, estado:', orden.estado);
      alert('Solo se pueden editar órdenes en estado Pendiente');
    }
  };

  const handleEliminar = (orden: OrdenCompra) => {
    if (orden.estado === 'Pendiente') {
      setOrdenAEliminar(orden);
      setMostrarModalEliminacion(true);
    } else {
      alert('Solo se pueden eliminar órdenes en estado Pendiente');
    }
  };

  const confirmarEliminacion = async () => {
    if (!ordenAEliminar) return;

    try {
      setEliminando(true);
      
      await ordenCompraService.deleteById(ordenAEliminar.id);
      
      // Recargar datos
      await cargarOrdenesCompra();
      await cargarEstadisticas();
      
      setMostrarModalEliminacion(false);
      setOrdenAEliminar(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la orden de compra');
      console.error('Error eliminando orden de compra:', err);
    } finally {
      setEliminando(false);
    }
  };

  const cerrarModalEliminacion = () => {
    setMostrarModalEliminacion(false);
    setOrdenAEliminar(null);
  };

  if (loading && ordenesCompra.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Cargando órdenes de compra...</p>
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
          onClick={cargarOrdenesCompra}
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
        <h1 className="ordenes-compra-title">Órdenes de Compra</h1>
        <div className="ordenes-compra-actions">
          <button 
            onClick={handleAgregar}
            className="btn btn-primary"
          >
            <MdAdd />
            Agregar orden de compra
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-container">
        <div className="estadistica-card total">
          <div className="estadistica-icon">
            <MdShoppingCart />
          </div>
          <div className="estadistica-label">Total</div>
          <div className="estadistica-value">{estadisticas.total}</div>
        </div>
        <div className="estadistica-card pendientes">
          <div className="estadistica-icon">
            <MdShoppingCart />
          </div>
          <div className="estadistica-label">Pendientes</div>
          <div className="estadistica-value">{estadisticas.pendientes}</div>
        </div>
        <div className="estadistica-card enviadas">
          <div className="estadistica-icon">
            <MdShoppingCart />
          </div>
          <div className="estadistica-label">Enviadas</div>
          <div className="estadistica-value">{estadisticas.enviadas}</div>
        </div>
        <div className="estadistica-card finalizadas">
          <div className="estadistica-icon">
            <MdShoppingCart />
          </div>
          <div className="estadistica-label">Finalizadas</div>
          <div className="estadistica-value">{estadisticas.finalizadas}</div>
        </div>
        <div className="estadistica-card canceladas">
          <div className="estadistica-icon">
            <MdShoppingCart />
          </div>
          <div className="estadistica-label">Canceladas</div>
          <div className="estadistica-value">{estadisticas.canceladas}</div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="filtros-container">
        <Buscador 
          value={busqueda} 
          onChange={handleBuscar} 
          placeholder="Buscar por número, proveedor o artículo..." 
        />
        <FiltrosRapidos
          activo={filtroEstado}
          onSeleccionar={handleFiltroRapido}
          opciones={["Todos", "Pendiente", "Enviada", "Finalizada", "Cancelada"]}
        />
      </div>

      {ordenesCompra.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <MdShoppingCart style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }} />
          <p>No se encontraron órdenes de compra con los filtros aplicados</p>
        </div>
      ) : (
        <TablaGenerica
          datos={ordenesCompra}
          columnas={[
            { 
              header: "Número", 
              render: (o: OrdenCompra) => <strong>{o.numero}</strong> 
            },
            { 
              header: "Fecha", 
              render: (o: OrdenCompra) => new Date(o.fechaCreacion).toLocaleDateString('es-ES') 
            },
            { 
              header: "Proveedor", 
              render: (o: OrdenCompra) => o.proveedor.nombre 
            },
            { 
              header: "Artículo", 
              render: (o: OrdenCompra) => o.articulo.nombre 
            },
            { 
              header: "Cantidad", 
              render: (o: OrdenCompra) => o.cantidad 
            },
            { 
              header: "Total", 
              render: (o: OrdenCompra) => (
                <strong style={{ color: '#28a745' }}>
                  ${o.total.toLocaleString()}
                </strong>
              ) 
            },
            { 
              header: "Estado", 
              render: (o: OrdenCompra) => (
                <span className={`estado-badge estado-${o.estado.toLowerCase()}`}>
                  {o.estado}
                </span>
              ) 
            }
          ]}
          onEditar={(o) => handleEditar(o)}
          onEliminar={(o) => handleEliminar(o)}
        />
      )}

      {/* Modal de eliminación */}
      {mostrarModalEliminacion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirmar eliminación</h3>
            </div>
            <p style={{ marginBottom: '1.5rem' }}>
              ¿Estás seguro de que deseas eliminar la orden de compra? Esta acción no se puede deshacer. 
              La orden de compra <strong>"{ordenAEliminar?.numero}"</strong> será eliminada permanentemente.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={cerrarModalEliminacion}
                disabled={eliminando}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion}
                disabled={eliminando}
                className="btn btn-danger"
              >
                <MdDelete />
                {eliminando ? 'Eliminando...' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdenesCompra;