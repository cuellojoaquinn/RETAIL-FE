import { useState, useEffect } from "react";
import Buscador from "../../components/Buscador";
import BotonAgregar from "../../components/BotonAgregar";
import { MdDelete, MdWarning, MdInventory, MdShoppingCart, MdRefresh, MdAdd, MdEdit } from 'react-icons/md';

import "../../styles/Articulos.css";
import TablaGenerica from "../../components/TablaGenerica";
import { useNavigate } from "react-router-dom";
import FiltrosRapidos from "../../components/FiltrosRapidos";
import articuloService from "../../services/articulo.service.real";
import type { Articulo } from "../../services/articulo.service.real";
import Notificacion from "../../components/Notificacion";

interface OrdenCompra {
  id: number;
  codigoArticulo: string;
  estado: "Pendiente" | "En proceso" | "Completada" | "Cancelada";
  cantidad: number;
  fechaCreacion: string;
}

// Datos simulados de órdenes de compra
const ordenesCompraMock: OrdenCompra[] = [
  {
    id: 1,
    codigoArticulo: "A001",
    estado: "Pendiente",
    cantidad: 25,
    fechaCreacion: "2024-01-15"
  },
  {
    id: 2,
    codigoArticulo: "A001",
    estado: "En proceso",
    cantidad: 10,
    fechaCreacion: "2024-01-20"
  },
  {
    id: 3,
    codigoArticulo: "A002",
    estado: "Pendiente",
    cantidad: 15,
    fechaCreacion: "2024-01-18"
  },
  {
    id: 4,
    codigoArticulo: "A003",
    estado: "Pendiente",
    cantidad: 30,
    fechaCreacion: "2024-01-22"
  }
];

const Articulos = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [articulosFiltrados, setArticulosFiltrados] = useState<Articulo[]>([]);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [articuloAEliminar, setArticuloAEliminar] = useState<Articulo | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [tamañoPagina] = useState(10);
  const [totalElementos, setTotalElementos] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const navigate = useNavigate();

  // Cargar artículos al montar el componente
  useEffect(() => {
    cargarArticulos();
  }, [pagina, tamañoPagina]);

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await articuloService.findAll(pagina, tamañoPagina);
      setArticulos(response.content);
      setArticulosFiltrados(response.content);
      setTotalElementos(response.totalElements);
      setTotalPaginas(response.totalPages);
      
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error cargando artículos';
      setError(mensaje);
      console.error('Error cargando artículos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar artículos
  const handleBuscar = async (termino: string) => {
    setBusqueda(termino);
    
    if (!termino.trim()) {
      setArticulosFiltrados(articulos);
      return;
    }

    try {
      const resultados = await articuloService.searchArticulos(termino);
      setArticulosFiltrados(resultados);
    } catch (err) {
      console.error('Error buscando artículos:', err);
      // Si falla la búsqueda, mostrar todos los artículos
      setArticulosFiltrados(articulos);
    }
  };

  // Manejar filtros rápidos
  const handleFiltroRapido = async (filtro: string) => {
    setFiltroEstado(filtro);
    
    if (!filtro || filtro === 'Todos') {
      // Cargar todos los artículos desde el backend
      try {
        setLoading(true);
        const response = await articuloService.findAll(pagina, tamañoPagina);
        setArticulos(response.content);
        setArticulosFiltrados(response.content);
        setTotalElementos(response.totalElements);
        setTotalPaginas(response.totalPages);
      } catch (err) {
        console.error('Error cargando todos los artículos:', err);
        setError('Error cargando artículos');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      let resultados: Articulo[] = [];
      
      if (filtro === 'Activo') {
        resultados = articulos.filter(a => !a.fechaBajaArticulo);
      } else if (filtro === 'Inactivo') {
        resultados = articulos.filter(a => a.fechaBajaArticulo);
      } else if (filtro === 'Faltantes') {
        resultados = await articuloService.getArticulosFaltantes();
      } else if (filtro === 'A reponer') {
        resultados = await articuloService.getArticulosAReponer();
      }
      
      setArticulosFiltrados(resultados);
    } catch (err) {
      console.error('Error aplicando filtro:', err);
      setArticulosFiltrados(articulos);
    }
  };

  const handleAgregar = () => {
    navigate("/articulos/nuevo");
  };

  const handleEditar = (id: number) => {
    navigate(`/articulos/editar/${id}`);
  };

  const verificarEliminacion = (articulo: Articulo) => {
    // Verificar si tiene inventario
    if (articulo.stockActual > 0) {
      setArticuloAEliminar(articulo);
      setMostrarModalEliminacion(true);
      return;
    }

    // Verificar si tiene órdenes de compra pendientes
    const ordenesPendientes = ordenesCompraMock.filter(
      (orden) =>
        orden.codigoArticulo === articulo.codArticulo.toString() &&
        (orden.estado === "Pendiente" || orden.estado === "En proceso")
    );

    if (ordenesPendientes.length > 0) {
      setArticuloAEliminar(articulo);
      setMostrarModalEliminacion(true);
      return;
    }

    // Si no hay restricciones, eliminar directamente
    handleEliminar(articulo);
  };

  const handleEliminar = async (articulo: Articulo) => {
    try {
      setEliminando(true);
      await articuloService.deleteById(articulo.id);
      
      // Recargar artículos
      await cargarArticulos();
      
      // Cerrar modal
      setMostrarModalEliminacion(false);
      setArticuloAEliminar(null);
      
      // Mostrar mensaje de éxito
      alert("Artículo eliminado correctamente");
      
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al eliminar el artículo';
      
      // Mostrar alerta específica según el tipo de error
      if (mensaje.includes('inventario') || mensaje.includes('stock')) {
        alert(`No se puede eliminar el artículo "${articulo.nombre}" porque tiene ${articulo.stockActual} unidades en inventario.`);
      } else if (mensaje.includes('orden') || mensaje.includes('compra')) {
        alert(`No se puede eliminar el artículo "${articulo.nombre}" porque tiene órdenes de compra pendientes.`);
      } else {
        alert(mensaje);
      }
      
      console.error('Error eliminando artículo:', err);
    } finally {
      setEliminando(false);
    }
  };

  const confirmarEliminacion = () => {
    if (articuloAEliminar) {
      handleEliminar(articuloAEliminar);
    }
  };

  const cerrarModalEliminacion = () => {
    setMostrarModalEliminacion(false);
    setArticuloAEliminar(null);
  };

  // Obtener artículos a reponer
  const [articulosAReponer, setArticulosAReponer] = useState<Articulo[]>([]);

  useEffect(() => {
    const cargarArticulosAReponer = async () => {
      try {
        const aReponer = await articuloService.getArticulosAReponer();
        setArticulosAReponer(aReponer);
      } catch (err) {
        console.error('Error cargando artículos a reponer:', err);
      }
    };

    cargarArticulosAReponer();
  }, []);

  // Preparar datos para la tabla
  const datosTabla = articulosFiltrados.map((articulo) => ({
    id: articulo.id,
    codArticulo: articulo.codArticulo,
    nombre: articulo.nombre,
    descripcion: articulo.descripcion,
    estado: articulo.fechaBajaArticulo ? 'Inactivo' : 'Activo',
    costoVenta: articulo.costoVenta,
    stockActual: articulo.stockActual,
    stockSeguridad: articulo.stockSeguridad,
    demandaArticulo: articulo.demandaArticulo,
    costoAlmacenamiento: articulo.costoAlmacenamiento,
  }));

  if (loading && articulos.length === 0) {
    return (
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
        <p>Cargando artículos...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#dc3545'
      }}>
        <MdWarning style={{ fontSize: '3rem', marginBottom: '1rem' }} />
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          onClick={cargarArticulos}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className='articulos-container'>
      <h1>Artículos</h1>
      
      <div className='articulos-header'>
        <Buscador value={busqueda} onChange={handleBuscar} placeholder="Buscar artículos..." />
        <div className='articulos-header'>
          <FiltrosRapidos
            activo={filtroEstado || "Todos"}
            onSeleccionar={handleFiltroRapido}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={cargarArticulos}
            disabled={loading}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <MdRefresh style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Actualizar
          </button>
          <BotonAgregar onClick={handleAgregar} texto='Agregar artículo' />
        </div>
      </div>
      
      {/* Tabla con paginación */}
      <div style={{ marginBottom: '1rem' }}>
        <TablaGenerica
          datos={articulosFiltrados}
          columnas={[
            { header: "Código", render: (a) => <strong>{a.codArticulo || 'Sin código'}</strong> },
            { header: "Nombre", render: (a) => <strong>{a.nombre || 'Sin nombre'}</strong> },
            { header: "Descripción", render: (a) => <span>{a.descripcion || 'Sin descripción'}</span> },
            {
              header: "Estado",
              render: (a) => (
                <span className={`estado ${a.fechaBajaArticulo ? 'inactivo' : 'activo'}`}>
                  {a.fechaBajaArticulo ? 'Inactivo' : 'Activo'}
                </span>
              ),
            },
            { header: "Precio", render: (a) => `$${(a.costoVenta || 0).toLocaleString()}` },
            { 
              header: "Inventario", 
              render: (a) => (
                <span style={{ 
                  color: (a.stockActual || 0) <= (a.stockSeguridad || 0) ? '#dc3545' : 
                         (a.stockActual || 0) === 0 ? '#ffc107' : '#28a745',
                  fontWeight: 'bold'
                }}>
                  {a.stockActual || 0}
                </span>
              ) 
            },
            { header: "Stock de seguridad", render: (a) => a.stockSeguridad || 0 },
            { header: "Demanda", render: (a) => (a.demandaArticulo || 0).toLocaleString() },
            { header: "Costo almacenamiento", render: (a) => `$${(a.costoAlmacenamiento || 0).toFixed(2)}` },
          ]}
          onEditar={(a) => handleEditar(a.id)}
          onEliminar={(a) => verificarEliminacion(a)}
        />
      </div>
      

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem',
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <button 
            onClick={() => setPagina(Math.max(0, pagina - 1))}
            disabled={pagina === 0 || loading}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: pagina === 0 ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: pagina === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Anterior
          </button>
          
          <span style={{ fontWeight: 'bold' }}>
            Página {pagina + 1} de {totalPaginas} ({totalElementos} artículos)
          </span>
          
          <button 
            onClick={() => setPagina(Math.min(totalPaginas - 1, pagina + 1))}
            disabled={pagina === totalPaginas - 1 || loading}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: pagina === totalPaginas - 1 ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: pagina === totalPaginas - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de eliminación */}
      {mostrarModalEliminacion && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            maxWidth: '500px', 
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {articuloAEliminar && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <MdWarning style={{ fontSize: '2rem', color: '#dc3545', marginRight: '1rem' }} />
                  <h3 style={{ margin: 0, color: '#dc3545' }}>No se puede eliminar</h3>
                </div>
                
                <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
                  No se puede eliminar el artículo <strong>"{articuloAEliminar.nombre}"</strong> por las siguientes razones:
                </p>

                {/* Verificar inventario */}
                {articuloAEliminar.stockActual > 0 && (
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    border: '1px solid #dee2e6',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <MdInventory style={{ color: '#dc3545', marginRight: '0.5rem' }} />
                      <strong>Inventario disponible:</strong>
                    </div>
                    <p style={{ margin: '0.25rem 0' }}>
                      • Unidades en inventario: <strong>{articuloAEliminar.stockActual}</strong>
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>
                      • Stock de seguridad: <strong>{articuloAEliminar.stockSeguridad}</strong>
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                      <em>Debe vender o transferir todo el inventario antes de eliminar el artículo.</em>
                    </p>
                  </div>
                )}

                {/* Verificar órdenes de compra */}
                {(() => {
                  const ordenesPendientes = ordenesCompraMock.filter(
                    (orden) =>
                      orden.codigoArticulo === articuloAEliminar.codArticulo.toString() &&
                      (orden.estado === "Pendiente" || orden.estado === "En proceso")
                  );

                  if (ordenesPendientes.length > 0) {
                    return (
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        border: '1px solid #dee2e6',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <MdShoppingCart style={{ color: '#ffc107', marginRight: '0.5rem' }} />
                          <strong>Órdenes de compra pendientes:</strong>
                        </div>
                        <p style={{ margin: '0.25rem 0' }}>
                          • Total de órdenes: <strong>{ordenesPendientes.length}</strong>
                        </p>
                        <p style={{ margin: '0.25rem 0' }}>
                          • Cantidad total: <strong>{ordenesPendientes.reduce((sum, orden) => sum + orden.cantidad, 0)} unidades</strong>
                        </p>
                        <div style={{ marginTop: '0.5rem' }}>
                          <strong>Órdenes:</strong>
                          {ordenesPendientes.map((orden) => (
                            <div key={orden.id} style={{ 
                              margin: '0.25rem 0', 
                              padding: '0.5rem', 
                              backgroundColor: 'white', 
                              borderRadius: '4px',
                              fontSize: '0.9rem'
                            }}>
                              • ID: {orden.id} | Estado: {orden.estado} | Cantidad: {orden.cantidad} | Fecha: {orden.fechaCreacion}
                            </div>
                          ))}
                        </div>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                          <em>Debe cancelar o completar todas las órdenes pendientes antes de eliminar el artículo.</em>
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={cerrarModalEliminacion}
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
                    Entendido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Articulos;
