import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Buscador from '../../components/Buscador';
import TablaGenerica from '../../components/TablaGenerica';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';
import CampoTexto from '../../components/CampoText';
import { MdEdit, MdClose } from 'react-icons/md';
import proveedorService, { type ProveedorBackend, type ArticuloProveedor } from '../../services/proveedor.service.real';
import articuloServiceReal from '../../services/articulo.service.real';

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
  const [proveedores, setProveedores] = useState<ProveedorBackend[]>([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<ProveedorBackend[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<ProveedorBackend | null>(null);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloEnEdicion, setArticuloEnEdicion] = useState<Articulo | null>(null);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [articuloAEliminar, setArticuloAEliminar] = useState<Articulo | null>(null);
  const [errorModal, setErrorModal] = useState<ErrorModal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    cargarProveedores();
    
    if (location.state?.mensaje) {
      // Mostrar mensaje de éxito si viene de otra página
      setTimeout(() => {
        // Limpiar el mensaje después de 5 segundos
        navigate(location.pathname, { replace: true });
      }, 5000);
    }
  }, [location.state?.mensaje]);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const proveedoresData = await proveedorService.findAll();
      setProveedores(proveedoresData);
      setProveedoresFiltrados(proveedoresData);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error cargando proveedores';
      setError(mensaje);
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
      setError('');
      const articulosData = await proveedorService.getArticulosPorProveedor(proveedorId);
      
      // Obtener códigos de artículos del servicio de artículos
      const articulosConCodigos = await Promise.all(
        articulosData.map(async (art) => {
          let codigoArticulo = art.codigo || art.articuloId?.toString() || 'Sin código';
          
          // Si tenemos articuloId, intentar obtener el código del servicio de artículos
          if (art.articuloId && !art.codigo) {
            try {
              const articuloCompleto = await articuloServiceReal.findById(art.articuloId);
              if (articuloCompleto && articuloCompleto.codArticulo) {
                codigoArticulo = articuloCompleto.codArticulo.toString();
              }
            } catch (error) {
              console.warn(`No se pudo obtener el código del artículo ${art.articuloId}:`, error);
            }
          }
          
          return {
            ...art,
            codigoArticulo
          };
        })
      );
      
      // Transformar los datos al formato esperado por la tabla
      const articulosTransformados: Articulo[] = articulosConCodigos.map(art => ({
        nombre: art.nombreArticulo || art.nombre || 'Sin nombre',
        codArticulo: art.codigoArticulo || 'Sin código',
        tipoModelo: art.tipoModelo || 'EOQ',
        demoraEntrega: art.demoraEntrega?.toString() || '0',
        costoUnidad: art.precioUnitario || art.precio || 0,
        costoPedido: art.cargosPedido || 0,
        tiempoRevision: art.tiempoRevision?.toString() || '0',
        esPredeterminado: art.esPredeterminado
      }));
      
      setArticulos(articulosTransformados);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error cargando artículos del proveedor';
      setError(mensaje);
      console.error('Error cargando artículos del proveedor:', err);
      setArticulos([]);
    }
  };

  // Filtrar proveedores por búsqueda
  useEffect(() => {
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase();
      const filtrados = proveedores.filter(prov => {
        const nombre = prov.nombre || prov.nombreProveedor || `Proveedor ${prov.id}`;
        return nombre.toLowerCase().includes(terminoBusqueda);
      });
      setProveedoresFiltrados(filtrados);
    } else {
      setProveedoresFiltrados(proveedores);
    }
  }, [busqueda, proveedores]);

  const cerrarErrorModal = () => setErrorModal(null);

  const limpiarBusqueda = () => {
    setBusqueda('');
    setProveedorSeleccionado(null);
    setArticulos([]);
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Proveedores</h1>
        <BotonAgregar onClick={() => navigate('/proveedores/alta')} texto="Agregar proveedor" />
      </div>

      {error && (
        <div style={{ marginBottom: '1rem' }}>
          <Notificacion tipo='error' mensaje={error} />
        </div>
      )}

      {location.state?.mensaje && (
        <div style={{ marginBottom: '1rem' }}>
          <Notificacion tipo='exito' mensaje={location.state.mensaje} />
        </div>
      )}

      {loading ? (
        <div style={{ 
          padding: '2rem', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh'
        }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f3f3', 
            borderTop: '4px solid #007bff', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }} />
          <p>Cargando proveedores...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : proveedores.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>No hay proveedores</h3>
          <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
            No se encontraron proveedores en el sistema. 
            Puedes agregar el primer proveedor haciendo clic en "Agregar proveedor".
          </p>
          <button 
            onClick={() => navigate('/proveedores/alta')}
            style={{ 
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Agregar primer proveedor
          </button>
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
          </div>

          {proveedoresFiltrados.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>Proveedores encontrados:</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {proveedoresFiltrados.map(prov => (
                  <button
                    key={prov.id}
                    onClick={() => {
                      setProveedorSeleccionado(prov);
                      cargarArticulosProveedor(prov.id);
                    }}
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
                    {prov.nombre || prov.nombreProveedor || `Proveedor ${prov.id}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {proveedorSeleccionado && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Artículos del proveedor: {proveedorSeleccionado.nombre || proveedorSeleccionado.nombreProveedor || `Proveedor ${proveedorSeleccionado.id}`}</h3>
                <button
                  onClick={() => navigate(`/proveedores/editar/${proveedorSeleccionado.id}`)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <MdEdit /> Editar Proveedor
                </button>
              </div>
              
              {articulos.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ color: '#6c757d', margin: 0 }}>
                    Este proveedor no tiene artículos asignados.
                  </p>
                </div>
              ) : (
                <TablaGenerica
                  datos={articulos}
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
                    )}
                  ]}
                />
              )}
            </div>
          )}

          {/* Modal de error */}
          {errorModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: errorModal.tipo === 'error' ? '#dc3545' : '#28a745' }}>
                    {errorModal.titulo}
                  </h3>
                  <button 
                    onClick={cerrarErrorModal}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666' }}
                  >
                    <MdClose />
                  </button>
                </div>
                <p style={{ margin: 0, color: '#666' }}>{errorModal.subtitulo}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Proveedores;