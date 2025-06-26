// 📁 src/views/OrdenDeCompra/OrdenesCompra.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdShoppingCart, MdWarning, MdDelete, MdAdd, MdSearch, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Buscador from '../../components/Buscador';
import FiltrosRapidos from '../../components/FiltrosRapidos';
import TablaGenerica from '../../components/TablaGenerica';
import ordenCompraService, { type OrdenCompra } from '../../services/ordenCompra.service.real';
import '../../styles/OrdenDeCompra.css';
import '../../styles/TablaArticulos.css';

const OrdenesCompra = () => {
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("Todos");
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [ordenAEliminar, setOrdenAEliminar] = useState<OrdenCompra | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [filtroSeleccionado, setFiltroSeleccionado] = useState("Todas");

  const navigate = useNavigate();

  const estadoMap: Record<string, string> = {
    Pendiente: 'PENDIENTE',
    Enviada: 'ENVIADO',
    Finalizada: 'FINALIZADO',
    Cancelada: 'CANCELADO',
  };

  // Cargar órdenes de compra al montar el componente
  useEffect(() => {
    cargarOrdenesCompra();
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
    // try {
    //   const data = await ordenCompraService.getEstadisticas();
    //   setEstadisticas(data);
    // } catch (error) {
    //   console.error("Error cargando estadísticas:", error);
    // }
  };

  const handleBuscar = (termino: string) => {
    setTerminoBusqueda(termino);
  };

  const handleFiltroRapido = (filtro: string) => {
    setFiltroSeleccionado(filtro);
  };

  const handleAgregar = () => {
    navigate('/orden-compra/alta');
  };

  const handleEditar = (orden: OrdenCompra) => {
    navigate(`/orden-compra/editar/${orden.id}`);
  };

  const handleEliminar = (orden: OrdenCompra) => {
    navigate(`/orden-compra/eliminar/${orden.id}`);
  };

  const confirmarEliminacion = async () => {
    if (!ordenAEliminar) return;

    try {
      setEliminando(true);
      
      await ordenCompraService.deleteById(ordenAEliminar.id);
      
      // Recargar datos
      await cargarOrdenesCompra();
      
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

  const ordenesFiltradas = ordenesCompra
    .filter(o => {
      if (filtroSeleccionado === 'Todas') return true;
      const estadoFiltro = estadoMap[filtroSeleccionado] || filtroSeleccionado.toUpperCase();
      return o.estadoOrden.toUpperCase() === estadoFiltro;
    })
    .filter(o => {
      if (!terminoBusqueda) return true;
      const busqueda = terminoBusqueda.toLowerCase();
      return (
        o.id.toString().includes(busqueda) ||
        o.proveedorNombre.toLowerCase().includes(busqueda) ||
        o.articuloNombre.toLowerCase().includes(busqueda) ||
        o.estadoOrden.toLowerCase().includes(busqueda)
      );
    });

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

      {/* Filtros y búsqueda */}
      <div className="filtros-container">
        <Buscador
          value={terminoBusqueda}
          onChange={handleBuscar}
          placeholder="Buscar por ID, proveedor o artículo..."
        />
        <FiltrosRapidos
          activo={filtroSeleccionado}
          onSeleccionar={handleFiltroRapido}
          opciones={["Todas", "Pendiente", "Enviada", "Finalizada", "Cancelada"]}
        />
      </div>

      {ordenesFiltradas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <MdShoppingCart style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }} />
          <p>No se encontraron órdenes de compra con los filtros aplicados</p>
        </div>
      ) : (
        <div className="tabla-container">
          <table className="tabla-articulos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha de Creación</th>
                <th>Proveedor</th>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Monto Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{new Date(o.fechaCreacionOrdenCompra).toLocaleDateString()}</td>
                  <td>{o.proveedorNombre}</td>
                  <td>{o.articuloNombre}</td>
                  <td>{o.cantidad}</td>
                  <td>${o.montoTotal.toLocaleString()}</td>
                  <td>
                    <span className={`estado-badge estado-${o.estadoOrden.toLowerCase()}`}>
                      {o.estadoOrden}
                    </span>
                  </td>
                  <td>
                    <div className="acciones">
                      <button className="btn-accion editar" onClick={() => handleEditar(o)}>
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              La orden de compra seleccionada será eliminada permanentemente.
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