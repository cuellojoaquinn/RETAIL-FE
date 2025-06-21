// 📁 src/views/OrdenDeCompra/EliminarOrdenCompra.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdWarning, MdDelete, MdShoppingCart, MdPerson, MdInventory } from 'react-icons/md';
import '../../styles/OrdenDeCompra.css';
import ordenCompraService from '../../services/ordenCompra.service';
import type { OrdenCompra } from '../../services/ordenCompra.service';

const EliminarOrdenCompra = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordenCompra, setOrdenCompra] = useState<OrdenCompra | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);

  useEffect(() => {
    if (id) {
      cargarOrdenCompra(Number(id));
    }
  }, [id]);

  const cargarOrdenCompra = async (ordenId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando orden de compra con ID:', ordenId);
      
      const orden = await ordenCompraService.findById(ordenId);
      
      console.log('Orden encontrada:', orden);
      
      if (orden.estado !== 'Pendiente') {
        console.log('Orden no eliminable, estado:', orden.estado);
        setError('Solo se pueden eliminar órdenes en estado Pendiente');
        return;
      }

      console.log('Orden válida para eliminar');
      setOrdenCompra(orden);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando la orden de compra');
      console.error('Error cargando orden de compra:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = () => {
    setMostrarModalConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    if (!ordenCompra) return;

    try {
      setEliminando(true);
      console.log('Eliminando orden de compra:', ordenCompra.id);
      
      await ordenCompraService.deleteById(ordenCompra.id);
      
      console.log('Orden de compra eliminada exitosamente');
      alert('Orden de compra eliminada exitosamente');
      navigate('/ordenes-compra');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando la orden de compra');
      console.error('Error eliminando orden de compra:', err);
    } finally {
      setEliminando(false);
      setMostrarModalConfirmacion(false);
    }
  };

  const cerrarModal = () => {
    setMostrarModalConfirmacion(false);
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
          <h1 className="ordenes-compra-title">Eliminar orden de compra</h1>
        </div>
      </div>

      {/* Información de la orden */}
      <div className="formulario-container">
        <div className="alerta alerta-danger">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <MdWarning style={{ fontSize: '2rem', marginRight: '1rem' }} />
            <h3 style={{ margin: 0, color: '#721c24' }}>Confirmar eliminación</h3>
          </div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
            Está a punto de eliminar la orden de compra <strong>"{ordenCompra.numero}"</strong>. 
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="formulario-seccion">
          <h3>
            <MdShoppingCart />
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
            <label className="formulario-label">Estado</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`estado-badge estado-${ordenCompra.estado.toLowerCase()}`}>
                {ordenCompra.estado}
              </span>
              {ordenCompra.estado === 'Pendiente' && (
                <div className="alerta alerta-success">
                  <MdWarning style={{ marginRight: '0.5rem' }} />
                  Esta orden puede ser eliminada
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="formulario-seccion">
          <h3>
            <MdPerson />
            Información del proveedor
          </h3>
          
          <div className="formulario-campo">
            <label className="formulario-label">Nombre del proveedor</label>
            <input 
              type="text"
              value={ordenCompra.proveedor.nombre}
              readOnly
              className="formulario-input"
              style={{ backgroundColor: '#e9ecef' }}
            />
          </div>

          <div className="formulario-campo">
            <label className="formulario-label">Email del proveedor</label>
            <input 
              type="text"
              value={ordenCompra.proveedor.email}
              readOnly
              className="formulario-input"
              style={{ backgroundColor: '#e9ecef' }}
            />
          </div>
        </div>

        <div className="formulario-seccion">
          <h3>
            <MdInventory />
            Información del artículo
          </h3>
          
          <div className="formulario-grid">
            <div className="formulario-campo">
              <label className="formulario-label">Nombre del artículo</label>
              <input 
                type="text"
                value={ordenCompra.articulo.nombre}
                readOnly
                className="formulario-input"
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
            <div className="formulario-campo">
              <label className="formulario-label">Código del artículo</label>
              <input 
                type="text"
                value={ordenCompra.articulo.codigo}
                readOnly
                className="formulario-input"
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
          </div>

          <div className="formulario-grid">
            <div className="formulario-campo">
              <label className="formulario-label">Cantidad</label>
              <input 
                type="text"
                value={ordenCompra.cantidad}
                readOnly
                className="formulario-input"
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
            <div className="formulario-campo">
              <label className="formulario-label">Precio unitario</label>
              <input 
                type="text"
                value={`$${ordenCompra.precioUnitario.toLocaleString()}`}
                readOnly
                className="formulario-input"
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
          </div>

          <div className="formulario-campo">
            <label className="formulario-label">Total de la orden</label>
            <input 
              type="text"
              value={`$${ordenCompra.total.toLocaleString()}`}
              readOnly
              className="formulario-input"
              style={{ backgroundColor: '#e9ecef', fontWeight: 'bold', color: '#28a745' }}
            />
          </div>

          {ordenCompra.observaciones && (
            <div className="formulario-campo">
              <label className="formulario-label">Observaciones</label>
              <textarea
                value={ordenCompra.observaciones}
                readOnly
                rows={3}
                className="formulario-textarea"
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
          )}
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
            onClick={handleEliminar}
            disabled={ordenCompra.estado !== 'Pendiente'}
            className="btn btn-danger"
          >
            <MdDelete />
            Eliminar orden de compra
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarModalConfirmacion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Confirmar eliminación</h3>
            </div>
            <div style={{ padding: '1rem 0' }}>
              <div className="alerta alerta-danger">
                <MdWarning style={{ fontSize: '2rem', marginBottom: '1rem' }} />
                <h4 style={{ margin: '0 0 1rem 0', color: '#721c24' }}>¡Atención!</h4>
                <p style={{ margin: '0 0 1rem 0' }}>
                  Está a punto de eliminar permanentemente la orden de compra:
                </p>
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: '#f8d7da', 
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                    Número: {ordenCompra.numero}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    Proveedor: {ordenCompra.proveedor.nombre}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    Artículo: {ordenCompra.articulo.nombre}
                  </p>
                  <p style={{ margin: '0', fontWeight: 'bold', color: '#721c24' }}>
                    Total: ${ordenCompra.total.toLocaleString()}
                  </p>
                </div>
                <p style={{ margin: '0', fontWeight: 'bold' }}>
                  Esta acción no se puede deshacer. ¿Está seguro de que desea continuar?
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={cerrarModal}
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
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EliminarOrdenCompra;
