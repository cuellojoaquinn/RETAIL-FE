// 📁 src/views/OrdenDeCompra/AltaOrdenCompra.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdWarning, 
  MdPerson,
  MdInventory,
  MdDescription
} from 'react-icons/md';
import '../../styles/OrdenDeCompra.css';
import ordenCompraService from '../../services/ordenCompra.service.real';
import proveedorService, { type ProveedorBackend } from '../../services/proveedor.service.real';
import articuloService, { type Articulo as ServiceArticulo } from '../../services/articulo.service.real';
import type { CrearOrdenCompraDTO } from '../../services/ordenCompra.service.real';

// La interfaz para el estado del formulario en el componente
interface OrdenCompraForm {
  proveedorId: number | null;
  articuloId: number | null;
  cantidad: number;
}

const AltaOrdenCompra = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proveedores, setProveedores] = useState<ProveedorBackend[]>([]);
  const [articulos, setArticulos] = useState<ServiceArticulo[]>([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState<ServiceArticulo[]>([]);
  const [mostrarModalArticulos, setMostrarModalArticulos] = useState(false);
  const [busquedaArticulos, setBusquedaArticulos] = useState('');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ServiceArticulo | null>(null);
  const [formulario, setFormulario] = useState<OrdenCompraForm>({
    proveedorId: null,
    articuloId: null,
    cantidad: 0
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
    cargarDatosIniciales();
  }, []);
  
  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await proveedorService.findAll();
      setProveedores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando proveedores');
    } finally {
      setLoading(false);
    }
  };

  const cargarArticulosPorProveedor = async (proveedorId: number) => {
    try {
      setLoading(true);
      setError(null);
      const articulosProveedor = await proveedorService.getArticulosPorProveedor(proveedorId);
      
      const articulosAdaptados: ServiceArticulo[] = articulosProveedor.map(ap => ({
        id: ap.articuloId || 0,
        codigo: ap.codigo || '',
        nombre: ap.nombreArticulo || 'Sin Nombre',
        descripcion: ap.descripcionArticulo || '',
        costoAlmacenamiento: 0,
        costoVenta: ap.precioUnitario || 0,
        stockActual: ap.stock || 0,
        produccionDiaria: 0,
        loteOptimo: 0,
        puntoPedido: ap.puntoPedido || 0,
        stockSeguridad: 0,
        demandaAnual: 0,
        demandaArticulo: 0,
        z: 0,
        desviacionEstandar: 0,
        proveedorPredeterminado: null,
        codArticulo: parseInt(ap.codigo || '0', 10),
        cgi: 0,
        inventarioMaximo: 0,
        fechaBajaArticulo: null
      }));

      setArticulos(articulosAdaptados);
      setArticulosFiltrados(articulosAdaptados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleProveedorChange = (proveedorId: number) => {
    setFormulario(prev => ({ ...prev, proveedorId, articuloId: null, cantidad: 0 }));
    setArticuloSeleccionado(null);
    cargarArticulosPorProveedor(proveedorId);
    setError(null); // Limpiar errores al cambiar de proveedor
  };

  const handleBuscarArticulos = (termino: string) => {
    setBusquedaArticulos(termino);
    
    if (!termino.trim()) {
      setArticulosFiltrados(articulos);
      return;
    }
    
    const filtrados = articulos.filter(
      articulo => (articulo.nombre || '').toLowerCase().includes(termino.toLowerCase()) || 
                  (articulo.codigo || '').toLowerCase().includes(termino.toLowerCase())
    );
    setArticulosFiltrados(filtrados);
  };

  const handleSeleccionarArticulo = (articulo: ServiceArticulo) => {
    setArticuloSeleccionado(articulo);
    setFormulario(prev => ({ ...prev, articuloId: articulo.id, cantidad: 0 }));
    setMostrarModalArticulos(false);
    setAdvertenciaPuntoPedido(false);
    setError(null); // Limpiar errores al seleccionar artículo
  };

  const handleCantidadChange = (cantidad: number) => {
    setFormulario(prev => ({ ...prev, cantidad }));
    
    if (articuloSeleccionado && cantidad > 0 && cantidad < articuloSeleccionado.puntoPedido) {
      setAdvertenciaPuntoPedido(true);
    } else {
      setAdvertenciaPuntoPedido(false);
    }
  };

  const validarFormulario = (): string[] => {
    const errores: string[] = [];
    if (!formulario.proveedorId) errores.push('Debe seleccionar un proveedor');
    if (!formulario.articuloId) errores.push('Debe seleccionar un artículo');
    if (formulario.cantidad <= 0) errores.push('La cantidad debe ser mayor a 0');
    return errores;
  };

  const handleGuardar = async () => {
    const erroresValidacion = validarFormulario();
    if (erroresValidacion.length > 0) {
      setError(erroresValidacion.join(', '));
      return;
    }

    setGuardando(true);
    setError(null);

    const payload: CrearOrdenCompraDTO = {
      proveedorId: formulario.proveedorId!,
      articuloId: formulario.articuloId!,
      cantidad: formulario.cantidad,
    };

    try {
      await ordenCompraService.save(payload);
      navigate('/orden-compra', { 
        state: { mensaje: 'Orden de compra creada exitosamente' }
      });
    } catch (err) {
      let msg = 'Error al guardar la orden de compra';
      if (err instanceof Error && err.message) {
        msg = err.message.replace(/\s*\(\d+\)$/, '');
      }
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  if (loading && proveedores.length === 0) {
    return <div>Cargando...</div>;
  }

  // El manejo de errores principal se muestra dentro del layout
  // para no perder el contexto de la página.

  return (
    <div className="ordenes-compra-container">
      <div className="ordenes-compra-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/orden-compra')}
            className="btn btn-secondary"
            style={{ marginRight: '1rem', padding: '0.5rem' }}
          >
            <MdArrowBack style={{ fontSize: '1.5rem' }} />
          </button>
          <h1 className="ordenes-compra-title">Crear orden de compra</h1>
        </div>
      </div>

      <div className="progreso-container">
        {estados.map((estado, index) => (
          <React.Fragment key={estado.nombre}>
            <div className="progreso-paso">
              <div className={`progreso-circulo ${estado.activo ? 'activo' : 'inactivo'}`}>{estado.icono}</div>
              <span className={`progreso-label ${estado.activo ? 'activo' : 'inactivo'}`}>{estado.nombre}</span>
            </div>
            {index < estados.length - 1 && (<div className={`progreso-linea ${estado.activo ? 'activo' : 'inactivo'}`} />)}
          </React.Fragment>
        ))}
      </div>
      
      {error && (
        <div className="alerta alerta-error" style={{maxWidth: '800px', margin: '0 auto 2rem auto'}}>
          <MdWarning />
          {error}
        </div>
      )}

      <div className="formulario-container">
        <div className="formulario-seccion">
          <h3><MdPerson /> 1. Proveedor</h3>
          {proveedores.length === 0 ? (
            <div className="alerta alerta-warning">
              <h4>No hay proveedores cargados</h4>
              <p>No se pueden crear órdenes de compra sin proveedores.</p>
            </div>
          ) : (
            <div className="formulario-campo">
              <label className="formulario-label">Seleccione un proveedor</label>
              <select 
                value={formulario.proveedorId || ''}
                onChange={(e) => handleProveedorChange(Number(e.target.value))}
                className="formulario-select"
              >
                <option value="" disabled>-- Seleccionar --</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre || proveedor.nombreProveedor}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {formulario.proveedorId && (
          <div className="formulario-seccion">
            <h3><MdInventory /> 2. Seleccionar Artículo</h3>
            {articuloSeleccionado ? (
              <div className="alerta alerta-success">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{articuloSeleccionado.nombre}</h4>
                    <p style={{ margin: '0', color: '#666' }}>Código: {articuloSeleccionado.codigo}</p>
                  </div>
                  <button onClick={() => setMostrarModalArticulos(true)} className="btn btn-secondary">Cambiar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setMostrarModalArticulos(true)} disabled={loading} className="btn btn-primary">
                {loading ? 'Cargando...' : 'Seleccionar artículo'}
              </button>
            )}
          </div>
        )}

        {articuloSeleccionado && (
          <div className="formulario-seccion">
            <h3><MdDescription /> 3. Formulario de Pedido</h3>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div className="formulario-campo">
                  <label className="formulario-label">Cantidad</label>
                  <input type="number" value={formulario.cantidad} onChange={(e) => handleCantidadChange(Number(e.target.value))} className="formulario-input" min="1" />
              </div>
              {advertenciaPuntoPedido && (
                <div className="alerta alerta-warning" style={{ marginTop: '0.5rem' }}>
                  <strong>Advertencia:</strong> La cantidad es menor al punto de pedido ({articuloSeleccionado.puntoPedido} unidades).
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button onClick={() => navigate('/orden-compra')} className="btn btn-secondary">Cancelar</button>
          <button onClick={handleGuardar} disabled={guardando || !formulario.articuloId || formulario.cantidad <= 0} className="btn btn-success">
            {guardando ? 'Creando orden...' : 'Crear orden de compra'}
          </button>
        </div>
      </div>

      {mostrarModalArticulos && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Seleccionar Artículo</h3>
              <button onClick={() => setMostrarModalArticulos(false)} className="modal-close">×</button>
            </div>
            <div className="formulario-campo">
              <input type="text" placeholder="Buscar artículos por nombre o código..." value={busquedaArticulos} onChange={(e) => handleBuscarArticulos(e.target.value)} className="formulario-input" />
            </div>
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {loading ? <p>Cargando...</p> : (articulosFiltrados.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6c757d' }}>No se encontraron artículos para este proveedor.</p>
              ) : (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {articulosFiltrados.map(articulo => (
                    <div key={articulo.id} onClick={() => handleSeleccionarArticulo(articulo)} className="articulo-seleccionable">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0' }}>{articulo.nombre}</h4>
                          <p style={{ margin: '0', color: '#666' }}>Código: {articulo.codigo}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#28a745' }}>${articulo.costoVenta.toLocaleString()}</p>
                          <p style={{ margin: '0', fontSize: '0.875rem', color: '#666' }}>Stock: {articulo.stockActual}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AltaOrdenCompra;

// CSS para articulo-seleccionable, ya que no estaba en el original
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