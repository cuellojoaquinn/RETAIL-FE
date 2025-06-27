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
import articuloService, { type ArticuloOrdenCompra } from '../../services/articulo.service.real';
import proveedorService, { type ProveedorBackend } from '../../services/proveedor.service.real';
import type { CrearOrdenCompraDTO } from '../../services/ordenCompra.service.real';

// La interfaz para el estado del formulario en el componente
interface OrdenCompraForm {
  articuloId: number | null;
  proveedorId: number | null;
  cantidad: number;
}

const AltaOrdenCompra = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articulosOrdenCompra, setArticulosOrdenCompra] = useState<ArticuloOrdenCompra[]>([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState<ArticuloOrdenCompra[]>([]);
  const [mostrarModalArticulos, setMostrarModalArticulos] = useState(false);
  const [busquedaArticulos, setBusquedaArticulos] = useState('');
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloOrdenCompra | null>(null);
  const [proveedores, setProveedores] = useState<ProveedorBackend[]>([]);
  const [formulario, setFormulario] = useState<OrdenCompraForm>({
    articuloId: null,
    proveedorId: null,
    cantidad: 0
  });
  const [guardando, setGuardando] = useState(false);

  // Estados del progreso
  const estados = [
    { nombre: 'Artículo', activo: !!articuloSeleccionado, icono: <MdInventory /> },
    { nombre: 'Proveedor', activo: !!formulario.proveedorId, icono: <MdPerson /> },
    { nombre: 'Detalles', activo: !!articuloSeleccionado && formulario.cantidad > 0, icono: <MdDescription /> }
  ];

  useEffect(() => {
    cargarDatosIniciales();
  }, []);
  
  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar artículos y proveedores en paralelo
      const [articulosData, proveedoresData] = await Promise.all([
        articuloService.getArticulosParaOrdenCompra(),
        proveedorService.findAll()
      ]);
      
      setArticulosOrdenCompra(articulosData);
      setArticulosFiltrados(articulosData);
      setProveedores(proveedoresData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarArticulos = (termino: string) => {
    setBusquedaArticulos(termino);
    
    if (!termino.trim()) {
      setArticulosFiltrados(articulosOrdenCompra);
      return;
    }
    
    const filtrados = articulosOrdenCompra.filter(
      articulo => articulo.nombreArticulo.toLowerCase().includes(termino.toLowerCase()) || 
                  articulo.codArticulo.toString().includes(termino)
    );
    setArticulosFiltrados(filtrados);
  };

  const handleSeleccionarArticulo = (articulo: ArticuloOrdenCompra) => {
    setArticuloSeleccionado(articulo);
    setFormulario(prev => ({ 
      ...prev, 
      articuloId: articulo.idArticulo, 
      proveedorId: articulo.idProveedorPredeterminado,
      cantidad: articulo.loteOptimo
    }));
    setMostrarModalArticulos(false);
    setError(null);
  };

  const handleCantidadChange = (cantidad: number) => {
    setFormulario(prev => ({ ...prev, cantidad }));
  };

  const handleProveedorChange = (proveedorId: number) => {
    setFormulario(prev => ({ ...prev, proveedorId }));
  };

  const validarFormulario = (): string[] => {
    const errores: string[] = [];
    if (!formulario.articuloId) errores.push('Debe seleccionar un artículo');
    if (!formulario.proveedorId) errores.push('Debe seleccionar un proveedor');
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

  if (loading && articulosOrdenCompra.length === 0) {
    return <div>Cargando...</div>;
  }

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
          <h3><MdInventory /> 1. Seleccionar Artículo</h3>
          {articuloSeleccionado ? (
            <div className="alerta alerta-success">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{articuloSeleccionado.nombreArticulo}</h4>
                  <p style={{ margin: '0', color: '#666' }}>Código: {articuloSeleccionado.codArticulo}</p>
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

        {articuloSeleccionado && (
          <div className="formulario-seccion">
            <h3><MdPerson /> 2. Información del Proveedor</h3>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div className="formulario-campo">
                <label className="formulario-label">Proveedor</label>
                <select 
                  value={formulario.proveedorId || ''}
                  onChange={(e) => handleProveedorChange(Number(e.target.value))}
                  className="formulario-select"
                >
                  <option value="" disabled>-- Seleccionar proveedor --</option>
                  {proveedores.map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.nombre || proveedor.nombreProveedor}
                      {proveedor.id === articuloSeleccionado.idProveedorPredeterminado && ' (Predeterminado)'}
                    </option>
                  ))}
                </select>
                <small style={{ color: '#6c757d', marginTop: '0.25rem', display: 'block' }}>
                  Proveedor predeterminado: {articuloSeleccionado.nombreProveedorPredeterminado}
                </small>
              </div>
              <div className="formulario-campo">
                <label className="formulario-label">Lote Óptimo Sugerido</label>
                <div style={{ padding: '0.75rem', backgroundColor: 'white', border: '1px solid #ced4da', borderRadius: '4px', color: '#28a745', fontWeight: 'bold' }}>
                  {articuloSeleccionado.loteOptimo} unidades
                </div>
              </div>
            </div>
          </div>
        )}

        {articuloSeleccionado && (
          <div className="formulario-seccion">
            <h3><MdDescription /> 3. Cantidad a Solicitar</h3>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div className="formulario-campo">
                <label className="formulario-label">Cantidad</label>
                <input 
                  type="number" 
                  value={formulario.cantidad} 
                  onChange={(e) => handleCantidadChange(Number(e.target.value))} 
                  className="formulario-input" 
                  min="1" 
                />
                <small style={{ color: '#6c757d', marginTop: '0.25rem', display: 'block' }}>
                  Lote óptimo sugerido: {articuloSeleccionado.loteOptimo} unidades
                </small>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button onClick={() => navigate('/orden-compra')} className="btn btn-secondary">Cancelar</button>
          <button 
            onClick={handleGuardar} 
            disabled={guardando || !formulario.articuloId || formulario.cantidad <= 0} 
            className="btn btn-success"
          >
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
              <input 
                type="text" 
                placeholder="Buscar artículos por nombre o código..." 
                value={busquedaArticulos} 
                onChange={(e) => handleBuscarArticulos(e.target.value)} 
                className="formulario-input" 
              />
            </div>
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {loading ? <p>Cargando...</p> : (articulosFiltrados.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6c757d' }}>No se encontraron artículos.</p>
              ) : (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {articulosFiltrados.map(articulo => (
                    <div key={articulo.idArticulo} onClick={() => handleSeleccionarArticulo(articulo)} className="articulo-seleccionable">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.25rem 0' }}>{articulo.nombreArticulo}</h4>
                          <p style={{ margin: '0', color: '#666' }}>Código: {articulo.codArticulo}</p>
                          <p style={{ margin: '0.25rem 0 0 0', color: '#28a745', fontSize: '0.875rem' }}>
                            Proveedor: {articulo.nombreProveedorPredeterminado}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#007bff' }}>
                            Lote óptimo: {articulo.loteOptimo}
                          </p>
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