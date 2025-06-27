// 📁 src/views/OrdenDeCompra/EditarOrdenCompra.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CampoTexto from '../../components/CampoText';
import { MdArrowBack, MdShoppingCart, MdWarning, MdCheckCircle, MdCancel, MdSend, MdRefresh, MdSchedule, MdEdit, MdPerson, MdInventory, MdDescription } from 'react-icons/md';
import '../../styles/OrdenDeCompra.css';
import ordenCompraService from '../../services/ordenCompra.service.real';
import type { OrdenCompra } from '../../services/ordenCompra.service.real';
import articuloService, { type ArticuloOrdenCompra } from '../../services/articulo.service.real';

const EditarOrdenCompra = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordenCompra, setOrdenCompra] = useState<OrdenCompra | null>(null);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloOrdenCompra | null>(null);
  const [formulario, setFormulario] = useState({
    cantidad: 0
  });
  const [guardando, setGuardando] = useState(false);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  // Estados del progreso
  const estados = [
    { 
      nombre: 'Pendiente', 
      activo: ordenCompra?.estadoOrden?.toUpperCase() === 'PENDIENTE', 
      icono: <MdSchedule /> 
    },
    { 
      nombre: 'Enviada', 
      activo: ordenCompra?.estadoOrden?.toUpperCase() === 'ENVIADO' || ordenCompra?.estadoOrden?.toUpperCase() === 'ENVIADA', 
      icono: <MdShoppingCart /> 
    },
    { 
      nombre: 'Finalizada', 
      activo: ordenCompra?.estadoOrden?.toUpperCase() === 'FINALIZADO' || ordenCompra?.estadoOrden?.toUpperCase() === 'FINALIZADA', 
      icono: <MdCheckCircle /> 
    },
    { 
      nombre: 'Cancelada', 
      activo: ordenCompra?.estadoOrden?.toUpperCase() === 'CANCELADA' || ordenCompra?.estadoOrden?.toUpperCase() === 'CANCELADO', 
      icono: <MdCancel /> 
    }
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

        setOrdenCompra(orden);
        setFormulario({
          cantidad: orden.cantidad
        });

        // Debug: mostrar el estado de la orden
        console.log('Estado de la orden:', orden.estadoOrden);
        console.log('Estado en mayúsculas:', orden.estadoOrden?.toUpperCase());

        // Buscar y seleccionar el artículo actual
        try {
          const articulos = await articuloService.getArticulosParaOrdenCompra();
          const articuloActual = articulos.find(a => a.idArticulo === orden.articuloId);
          if (articuloActual) {
            setArticuloSeleccionado(articuloActual);
          }
        } catch (err) {
          console.error('Error cargando información del artículo:', err);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando la orden de compra');
      } finally {
        setLoading(false);
      }
    };

    cargarOrden();
  }, [id]);

  const handleCantidadChange = (cantidad: number) => {
    setFormulario(prev => ({
      ...prev,
      cantidad
    }));
  };

  const calcularTotal = () => {
    return ordenCompra?.montoTotal || 0;
  };

  const esFormularioValido = () => {
    return formulario.cantidad > 0 && articuloSeleccionado !== null;
  };

  const handleGuardar = async () => {
    if (!esFormularioValido() || !ordenCompra || !articuloSeleccionado) return;

    try {
      setGuardando(true);
      
      // Preparar datos para actualizar
      const datosActualizados = {
        estadoOrden: ordenCompra.estadoOrden,
        cantidad: formulario.cantidad,
        articuloId: articuloSeleccionado.idArticulo,
        proveedorId: articuloSeleccionado.idProveedorPredeterminado
      };
      
      await ordenCompraService.updateOrden(ordenCompra.id, datosActualizados);
      
      alert('Orden de compra actualizada exitosamente');
      navigate('/orden-compra');
      
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
      let nuevoEstado: OrdenCompra['estadoOrden'];
      switch (ordenCompra.estadoOrden?.toUpperCase()) {
        case 'PENDIENTE':
          nuevoEstado = 'ENVIADO';
          break;
        case 'ENVIADO':
          nuevoEstado = 'FINALIZADO';
          break;
        default:
          nuevoEstado = ordenCompra.estadoOrden;
      }

      if (nuevoEstado === 'ENVIADO') {
        await ordenCompraService.updateOrden(ordenCompra.id, { 
          estadoOrden: nuevoEstado, 
          cantidad: formulario.cantidad 
        });
      } else {
        await ordenCompraService.updateOrden(ordenCompra.id, { estadoOrden: nuevoEstado });
      }
      
      // Actualizar el estado local
      setOrdenCompra(prev => prev ? { ...prev, estadoOrden: nuevoEstado } : null);
      
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
    
    switch (ordenCompra.estadoOrden?.toUpperCase()) {
      case 'PENDIENTE':
        return 'ENVIADO';
      case 'ENVIADO':
        return 'FINALIZADO';
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
          onClick={() => navigate('/orden-compra')}
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
          onClick={() => navigate('/orden-compra')}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Volver
        </button>
      </div>
    );
  }

  const siguienteEstado = obtenerSiguienteEstado();
  const camposDeshabilitados = ['ENVIADO', 'ENVIADA', 'FINALIZADA', 'FINALIZADO'].includes(ordenCompra?.estadoOrden?.toUpperCase() || '');

  return (
    <div className="ordenes-compra-container">
      {/* Header */}
      <div className="ordenes-compra-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/orden-compra')}
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
          {ordenCompra.estadoOrden?.toUpperCase() === 'PENDIENTE' && (
            <button
              onClick={async () => {
                setCambiandoEstado(true);
                try {
                  await ordenCompraService.updateOrden(ordenCompra.id, { estadoOrden: 'CANCELADO', cantidad: formulario.cantidad });
                  setOrdenCompra(prev => prev ? { ...prev, estadoOrden: 'CANCELADO' } : null);
                  alert('Orden de compra cancelada');
                  navigate('/orden-compra');
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Error cancelando la orden de compra');
                } finally {
                  setCambiandoEstado(false);
                }
              }}
              className="btn"
              style={{ backgroundColor: '#dc3545', color: 'white', marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              disabled={cambiandoEstado}
            >
              <MdWarning style={{ fontSize: '1.2rem' }} /> Cancelar orden
            </button>
          )}
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
                value={ordenCompra.id}
                readOnly
                className="formulario-input"
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
            <div className="formulario-campo">
              <label className="formulario-label">Fecha de creación</label>
              <input 
                type="text"
                value={new Date(ordenCompra.fechaCreacionOrdenCompra).toLocaleDateString('es-ES')}
                readOnly
                className="formulario-input"
                style={{ backgroundColor: '#e9ecef' }}
              />
            </div>
          </div>

          <div className="formulario-campo">
            <label className="formulario-label">Estado actual</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`estado-badge estado-${ordenCompra.estadoOrden.toLowerCase()}`}>
                {ordenCompra.estadoOrden}
              </span>
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
        {camposDeshabilitados ? (
          <div className="formulario-seccion">
            <h3>
              <MdInventory />
              Detalle de la orden de compra
            </h3>
            <div className="alerta alerta-info">
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{articuloSeleccionado?.nombreArticulo}</h4>
                <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                  Código: {articuloSeleccionado?.codArticulo}
                </p>
                <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                  Proveedor: {articuloSeleccionado?.nombreProveedorPredeterminado}
                </p>
                <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                  Cantidad: {formulario.cantidad}
                </p>
                <p style={{ margin: '0', color: '#666' }}>
                  Total: ${ordenCompra.montoTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sección para modificar cantidad solo en estado PENDIENTE */}
            {ordenCompra.estadoOrden?.toUpperCase() === 'PENDIENTE' && (
              <div className="formulario-seccion">
                <h3>
                  <MdDescription />
                  Modificar cantidad a pedir
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
                        min="1"
                      />
                      {articuloSeleccionado && (
                        <small style={{ color: '#6c757d', marginTop: '0.25rem', display: 'block' }}>
                          Lote óptimo sugerido: {articuloSeleccionado.loteOptimo} unidades
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="alerta alerta-success">
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#155724' }}>Total de la orden de compra</h4>
                    <p style={{ margin: '0', fontSize: '1.25rem', fontWeight: 'bold', color: '#155724' }}>
                      ${calcularTotal().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle de la orden de compra */}
            <div className="formulario-seccion">
              <h3>
                <MdInventory />
                Detalle de la orden de compra
              </h3>
              {articuloSeleccionado ? (
                <div className="alerta alerta-info">
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{articuloSeleccionado.nombreArticulo}</h4>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                      Código: {articuloSeleccionado.codArticulo}
                    </p>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                      Proveedor: {articuloSeleccionado.nombreProveedorPredeterminado}
                    </p>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                      Cantidad: {formulario.cantidad}
                    </p>
                    <p style={{ margin: '0', color: '#666' }}>
                      Total: ${ordenCompra.montoTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="alerta alerta-warning">
                  <p>No se encontró información del artículo</p>
                </div>
              )}
            </div>

            {/* Botones de acción solo para estado PENDIENTE */}
            {ordenCompra.estadoOrden?.toUpperCase() === 'PENDIENTE' && (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => navigate('/orden-compra')}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleGuardar}
                  disabled={guardando || !esFormularioValido()}
                  className="btn btn-success"
                >
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditarOrdenCompra;

// CSS para articulo-seleccionable
const styles = `
.articulo-seleccionable {
  padding: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  transition: background-color 0.2s;
}

.articulo-seleccionable:hover {
  background-color: #f1f3f5;
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
