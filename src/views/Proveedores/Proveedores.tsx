import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Buscador from '../../components/Buscador';
import TablaGenerica from '../../components/TablaGenerica';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';
import CampoTexto from '../../components/CampoText';
import { MdEdit, MdDelete, MdSave, MdClose } from 'react-icons/md';
import proveedorService from '../../services/proveedor.service.real';
import type { Proveedor, ArticuloProveedor } from '../../services/proveedor.service.real';

interface Articulo {
  nombre: string;
  codArticulo: string;
  tipoModelo: string;
  demoraEntrega: string;
  costoUnidad: number;
  costoPedido: number;
  tiempoRevision: string;
  esPredeterminado?: boolean;
}

interface ErrorModal {
  tipo: string;
  titulo: string;
  subtitulo: string;
}

const Proveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<Proveedor[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloEnEdicion, setArticuloEnEdicion] = useState<Articulo | null>(null);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [articuloAEliminar, setArticuloAEliminar] = useState<Articulo | null>(null);
  const [errorModal, setErrorModal] = useState<ErrorModal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Estados para edición
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [articuloAEditar, setArticuloAEditar] = useState<Articulo | null>(null);
  const [formularioEdicion, setFormularioEdicion] = useState({
    tipoModelo: '',
    demoraEntrega: '',
    costoUnidad: '',
    costoPedido: '',
    tiempoRevision: '',
    esPredeterminado: false
  });
  const [erroresEdicion, setErroresEdicion] = useState<{ [field: string]: boolean }>({});
  
  const navigate = useNavigate();

  // Cargar proveedores al montar el componente
  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const proveedoresData = await proveedorService.findAll();
      setProveedores(proveedoresData);
      setProveedoresFiltrados(proveedoresData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando proveedores');
      console.error('Error cargando proveedores:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar artículos cuando se selecciona un proveedor
  useEffect(() => {
    if (proveedorSeleccionado) {
      cargarArticulosProveedor(proveedorSeleccionado.id);
    } else {
      setArticulos([]);
    }
  }, [proveedorSeleccionado]);

  const cargarArticulosProveedor = async (proveedorId: number) => {
    try {
      const articulosData = await proveedorService.getArticulosPorProveedor(proveedorId);
      // Convertir ArticuloProveedor a Articulo para mantener compatibilidad
      const articulosConvertidos: Articulo[] = articulosData.map(ap => ({
        nombre: ap.nombre,
        codArticulo: ap.codigo,
        tipoModelo: 'Lote fijo', // Valor por defecto
        demoraEntrega: '5', // Valor por defecto
        costoUnidad: ap.precio,
        costoPedido: 100, // Valor por defecto
        tiempoRevision: '30', // Valor por defecto
        esPredeterminado: ap.esPredeterminado
      }));
      setArticulos(articulosConvertidos);
    } catch (err) {
      console.error('Error cargando artículos del proveedor:', err);
      setArticulos([]);
    }
  };

  // Filtrar proveedores por búsqueda
  useEffect(() => {
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase();
      const filtrados = proveedores.filter(prov => 
        prov.nombre.toLowerCase().includes(terminoBusqueda)
      );
      setProveedoresFiltrados(filtrados);
    } else {
      setProveedoresFiltrados(proveedores);
    }
  }, [busqueda, proveedores]);

  const confirmarEliminacion = () => {
    if (!articuloAEliminar) return;

    const { codArticulo } = articuloAEliminar;

    // Simulación de errores por codArticulo específico
    if (codArticulo === 'A001') {
      setErrorModal({
        tipo: 'orden',
        titulo: 'Orden de compra',
        subtitulo: 'Estado: Pendiente'
      });
    } else if (codArticulo === 'A002') {
      setErrorModal({
        tipo: 'inventario',
        titulo: 'Inventario',
        subtitulo: 'Hay artículos en el inventario'
      });
    } else {
      setArticulos(prev => prev.filter(a => a.codArticulo !== codArticulo));
    }

    setMostrarModalEliminacion(false);
  };

  const cerrarErrorModal = () => setErrorModal(null);

  const limpiarBusqueda = () => {
    setBusqueda('');
    setProveedorSeleccionado(null);
  };

  // Funciones para edición
  const abrirModalEdicion = (articulo: Articulo) => {
    setArticuloAEditar(articulo);
    setFormularioEdicion({
      tipoModelo: articulo.tipoModelo,
      demoraEntrega: articulo.demoraEntrega,
      costoUnidad: articulo.costoUnidad.toString(),
      costoPedido: articulo.costoPedido.toString(),
      tiempoRevision: articulo.tiempoRevision,
      esPredeterminado: articulo.esPredeterminado || false
    });
    setErroresEdicion({});
    setMostrarModalEdicion(true);
  };

  const cerrarModalEdicion = () => {
    setMostrarModalEdicion(false);
    setArticuloAEditar(null);
    setFormularioEdicion({
      tipoModelo: '',
      demoraEntrega: '',
      costoUnidad: '',
      costoPedido: '',
      tiempoRevision: '',
      esPredeterminado: false
    });
    setErroresEdicion({});
  };

  const handleCambioEdicion = (campo: string, valor: any) => {
    setFormularioEdicion(prev => ({ ...prev, [campo]: valor }));
    // Limpiar error al corregir
    if (erroresEdicion[campo]) {
      setErroresEdicion(prev => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[campo];
        return nuevosErrores;
      });
    }
  };

  const validarFormularioEdicion = (): boolean => {
    const errores: { [field: string]: boolean } = {};

    if (!formularioEdicion.tipoModelo) {
      errores.tipoModelo = true;
    }
    if (!formularioEdicion.demoraEntrega || isNaN(Number(formularioEdicion.demoraEntrega)) || Number(formularioEdicion.demoraEntrega) <= 0) {
      errores.demoraEntrega = true;
    }
    if (!formularioEdicion.costoUnidad || isNaN(Number(formularioEdicion.costoUnidad)) || Number(formularioEdicion.costoUnidad) <= 0) {
      errores.costoUnidad = true;
    }
    if (!formularioEdicion.costoPedido || isNaN(Number(formularioEdicion.costoPedido)) || Number(formularioEdicion.costoPedido) < 0) {
      errores.costoPedido = true;
    }
    if (!formularioEdicion.tiempoRevision || isNaN(Number(formularioEdicion.tiempoRevision)) || Number(formularioEdicion.tiempoRevision) <= 0) {
      errores.tiempoRevision = true;
    }

    setErroresEdicion(errores);
    return Object.keys(errores).length === 0;
  };

  const guardarEdicion = () => {
    if (!validarFormularioEdicion() || !articuloAEditar || !proveedorSeleccionado) {
      return;
    }

    // Actualizar el artículo en el estado local
    const articuloActualizado: Articulo = {
      ...articuloAEditar,
      tipoModelo: formularioEdicion.tipoModelo,
      demoraEntrega: formularioEdicion.demoraEntrega,
      costoUnidad: Number(formularioEdicion.costoUnidad),
      costoPedido: Number(formularioEdicion.costoPedido),
      tiempoRevision: formularioEdicion.tiempoRevision,
      esPredeterminado: formularioEdicion.esPredeterminado
    };

    setArticulos(prev => prev.map(art => 
      art.codArticulo === articuloAEditar.codArticulo ? articuloActualizado : art
    ));

    cerrarModalEdicion();
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Proveedores</h1>
        <BotonAgregar onClick={() => navigate('/proveedores/alta')} texto="Agregar proveedor" />
      </div>

      {proveedores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No se encontraron proveedores en el sistema</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Buscador
                value={busqueda}
                onChange={setBusqueda}
                placeholder="Buscar proveedor..."
              />
            </div>
            {busqueda && (
              <button 
                onClick={limpiarBusqueda}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>

          {proveedoresFiltrados.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>Proveedores encontrados:</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {proveedoresFiltrados.map(prov => (
                  <button
                    key={prov.id}
                    onClick={() => setProveedorSeleccionado(prov)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: proveedorSeleccionado?.id === prov.id ? '#5b3cc4' : '#fff',
                      color: proveedorSeleccionado?.id === prov.id ? 'white' : '#333',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: proveedorSeleccionado?.id === prov.id ? 'bold' : 'normal'
                    }}
                  >
                    {prov.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {proveedorSeleccionado && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>Artículos de {proveedorSeleccionado.nombre}:</h3>
              {articulos.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  Este proveedor no tiene artículos asociados
                </p>
              ) : (
                <TablaGenerica
                  datos={articulos.map((a) => ({
                    ...a,
                    acciones: (
                      <>
                        <button 
                          onClick={() => abrirModalEdicion(a)}
                          style={{ 
                            padding: '0.25rem 0.5rem', 
                            marginRight: '0.5rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          <MdEdit style={{ marginRight: '0.25rem' }} />
                          Editar
                        </button>
                        <button 
                          onClick={() => { setMostrarModalEliminacion(true); setArticuloAEliminar(a); }}
                          style={{ 
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          <MdDelete style={{ marginRight: '0.25rem' }} />
                          Eliminar
                        </button>
                      </>
                    )
                  }))}
                  columnas={[
                    { header: "Nombre", render: (a: any) => a.nombre },
                    { header: "Código", render: (a: any) => a.codArticulo },
                    { header: "Tipo Modelo", render: (a: any) => a.tipoModelo },
                    { header: "Demora entrega", render: (a: any) => `${a.demoraEntrega} días` },
                    { header: "Costo unidad", render: (a: any) => `$${a.costoUnidad}` },
                    { header: "Costo pedido", render: (a: any) => `$${a.costoPedido}` },
                    { header: "Tiempo Revisión", render: (a: any) => `${a.tiempoRevision} días` },
                    { header: "Predeterminado", render: (a: any) => a.esPredeterminado ? (
                      <span style={{ backgroundColor: '#FDD36D', color: '#8B4513', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                        SÍ
                      </span>
                    ) : (
                      <span style={{ color: '#666', fontSize: '0.8rem' }}>No</span>
                    )},
                    { header: "Acciones", render: (a: any) => a.acciones }
                  ]}
                />
              )}
            </div>
          )}

          {/* Modal de eliminación */}
          {mostrarModalEliminacion && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%' }}>
                <h3 style={{ marginTop: 0 }}>Confirmar eliminación</h3>
                <p>¿Desea eliminar el artículo "{articuloAEliminar?.nombre}" del proveedor: "{proveedorSeleccionado?.nombre}"?</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button 
                    onClick={() => setMostrarModalEliminacion(false)}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={confirmarEliminacion}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de edición */}
          {mostrarModalEdicion && articuloAEditar && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0 }}>Editar artículo</h3>
                  <button 
                    onClick={cerrarModalEdicion}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666' }}
                  >
                    <MdClose />
                  </button>
                </div>
                
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{articuloAEditar.nombre}</p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
                    Código: {articuloAEditar.codArticulo} • Proveedor: {proveedorSeleccionado?.nombre}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tipo de modelo</label>
                    <select 
                      value={formularioEdicion.tipoModelo} 
                      onChange={(e) => handleCambioEdicion('tipoModelo', e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '0.5rem', 
                        borderRadius: '4px', 
                        border: erroresEdicion.tipoModelo ? '1px solid #dc3545' : '1px solid #ccc' 
                      }}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Lote fijo">Lote fijo</option>
                      <option value="Intervalo fijo">Intervalo fijo</option>
                    </select>
                  </div>

                  <CampoTexto 
                    label="Demora de entrega (días)" 
                    name="demoraEntrega" 
                    value={formularioEdicion.demoraEntrega} 
                    onChange={(e) => handleCambioEdicion('demoraEntrega', e.target.value)} 
                    type="number" 
                    error={erroresEdicion.demoraEntrega}
                  />
                  
                  <CampoTexto 
                    label="Precio unitario ($)" 
                    name="costoUnidad" 
                    value={formularioEdicion.costoUnidad} 
                    onChange={(e) => handleCambioEdicion('costoUnidad', e.target.value)} 
                    type="number" 
                    error={erroresEdicion.costoUnidad}
                  />
                  
                  <CampoTexto 
                    label="Cargos de pedido ($)" 
                    name="costoPedido" 
                    value={formularioEdicion.costoPedido} 
                    onChange={(e) => handleCambioEdicion('costoPedido', e.target.value)} 
                    type="number" 
                    error={erroresEdicion.costoPedido}
                  />
                  
                  <CampoTexto 
                    label="Tiempo de revisión (días)" 
                    name="tiempoRevision" 
                    value={formularioEdicion.tiempoRevision} 
                    onChange={(e) => handleCambioEdicion('tiempoRevision', e.target.value)} 
                    type="number" 
                    error={erroresEdicion.tiempoRevision}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formularioEdicion.esPredeterminado}
                      onChange={(e) => handleCambioEdicion('esPredeterminado', e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Marcar como proveedor predeterminado para este artículo
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={cerrarModalEdicion}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={guardarEdicion}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    <MdSave style={{ marginRight: '0.25rem' }} />
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de error */}
          {errorModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%' }}>
                <h3 style={{ marginTop: 0, color: '#dc3545' }}>No se pudo efectuar la acción</h3>
                <p>Revisar:</p>
                <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0', backgroundColor: '#f8f9fa' }}>
                  <strong>{errorModal.titulo}</strong>
                  <p style={{ margin: '0.5rem 0 0 0' }}>{errorModal.subtitulo}</p>
                </div>
                <button 
                  onClick={cerrarErrorModal}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Entendido
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Proveedores;