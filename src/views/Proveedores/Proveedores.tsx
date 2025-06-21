import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Buscador from '../../components/Buscador';
import TablaGenerica from '../../components/TablaGenerica';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';

interface Proveedor {
  id: number;
  nombre: string;
}

interface Articulo {
  nombre: string;
  codArticulo: string;
  tipoModelo: string;
  demoraEntrega: string;
  costoUnidad: number;
  costoPedido: number;
  tiempoRevision: string;
}

interface ErrorModal {
  tipo: string;
  titulo: string;
  subtitulo: string;
}

const proveedoresMock: Proveedor[] = [
  { id: 1, nombre: 'Proveedor A' },
  { id: 2, nombre: 'Proveedor B' },
  { id: 3, nombre: 'Proveedor C' }
];

const articulosMock: { [key: number]: Articulo[] } = {
  1: [
    {
      nombre: 'Artículo A1',
      codArticulo: 'A001',
      tipoModelo: 'Lote fijo',
      demoraEntrega: '5 días',
      costoUnidad: 10,
      costoPedido: 100,
      tiempoRevision: 'Mensual'
    },
    {
      nombre: 'Artículo A2',
      codArticulo: 'A002',
      tipoModelo: 'Intervalo fijo',
      demoraEntrega: '3 días',
      costoUnidad: 15,
      costoPedido: 90,
      tiempoRevision: 'Trimestral'
    }
  ],
  2: [
    {
      nombre: 'Artículo B1',
      codArticulo: 'B001',
      tipoModelo: 'Lote fijo',
      demoraEntrega: '7 días',
      costoUnidad: 20,
      costoPedido: 150,
      tiempoRevision: 'Semanal'
    }
  ],
  3: []
};

const Proveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<Proveedor[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [articuloAEliminar, setArticuloAEliminar] = useState<Articulo | null>(null);
  const [errorModal, setErrorModal] = useState<ErrorModal | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setProveedores(proveedoresMock);
    setProveedoresFiltrados(proveedoresMock);
  }, []);

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

  useEffect(() => {
    if (proveedorSeleccionado) {
      setArticulos(articulosMock[proveedorSeleccionado.id] || []);
    } else {
      setArticulos([]);
    }
  }, [proveedorSeleccionado]);

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

    setMostrarModal(false);
  };

  const cerrarErrorModal = () => setErrorModal(null);

  const limpiarBusqueda = () => {
    setBusqueda('');
    setProveedorSeleccionado(null);
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
                        <button onClick={() => navigate(`/proveedores/editar/${proveedorSeleccionado.id}`)}>Editar</button>
                        <button onClick={() => { setMostrarModal(true); setArticuloAEliminar(a); }}>Eliminar</button>
                      </>
                    )
                  }))}
                  columnas={[
                    { header: "Nombre", render: (a: any) => a.nombre },
                    { header: "Código", render: (a: any) => a.codArticulo },
                    { header: "Tipo Modelo", render: (a: any) => a.tipoModelo },
                    { header: "Demora entrega", render: (a: any) => a.demoraEntrega },
                    { header: "Costo unidad", render: (a: any) => `$${a.costoUnidad}` },
                    { header: "Costo pedido", render: (a: any) => `$${a.costoPedido}` },
                    { header: "Tiempo Revisión", render: (a: any) => a.tiempoRevision },
                    { header: "Acciones", render: (a: any) => a.acciones }
                  ]}
                />
              )}
            </div>
          )}

          {mostrarModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
                <p>¿Desea eliminar el artículo "{articuloAEliminar?.nombre}" del proveedor: "{proveedorSeleccionado?.nombre}"?</p>
                <button onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button onClick={confirmarEliminacion}>Aceptar</button>
              </div>
            </div>
          )}

          {errorModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
                <h3>No se pudo efectuar la acción</h3>
                <p>Revisar</p>
                <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
                  <strong>{errorModal.titulo}</strong>
                  <p>{errorModal.subtitulo}</p>
                </div>
                <button onClick={cerrarErrorModal}>Entendido</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Proveedores;