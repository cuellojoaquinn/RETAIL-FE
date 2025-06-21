// 📁 src/views/OrdenesCompra/OrdenesCompra.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablaGenerica from '../../components/TablaGenerica';
import BotonAgregar from '../../components/BotonAgregar';
import Buscador from '../../components/Buscador';

interface OrdenCompra {
  id: string;
  estado: string;
  proveedor: string;
  articulo: string;
  fecha: string;
  monto: number;
}

const ordenesMock: OrdenCompra[] = [
  {
    id: 'OC001',
    estado: 'Pendiente',
    proveedor: 'Proveedor A',
    articulo: 'Artículo A1',
    fecha: '20/06/2025',
    monto: 300
  },
  {
    id: 'OC002',
    estado: 'Enviada',
    proveedor: 'Proveedor B',
    articulo: 'Artículo B1',
    fecha: '18/06/2025',
    monto: 200
  },
  {
    id: 'OC003',
    estado: 'Pendiente',
    proveedor: 'Proveedor C',
    articulo: 'Artículo C1',
    fecha: '22/06/2025',
    monto: 450
  }
];

const OrdenesCompra = () => {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [ordenesOriginales, setOrdenesOriginales] = useState<OrdenCompra[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setOrdenes(ordenesMock);
    setOrdenesOriginales(ordenesMock);
  }, []);

  // Filtrar órdenes por búsqueda y estado
  useEffect(() => {
    let ordenesFiltradas = ordenesOriginales;

    // Filtrar por búsqueda (ID, proveedor o artículo)
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase();
      ordenesFiltradas = ordenesFiltradas.filter(orden => 
        orden.id.toLowerCase().includes(terminoBusqueda) ||
        orden.proveedor.toLowerCase().includes(terminoBusqueda) ||
        orden.articulo.toLowerCase().includes(terminoBusqueda)
      );
    }

    // Filtrar por estado
    if (filtroEstado) {
      ordenesFiltradas = ordenesFiltradas.filter(orden => orden.estado === filtroEstado);
    }

    setOrdenes(ordenesFiltradas);
  }, [busqueda, filtroEstado, ordenesOriginales]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('');
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Órdenes de compra</h1>
        <BotonAgregar texto="Crear orden de compra" onClick={() => navigate('/ordenes/alta')} />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <Buscador
            value={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por ID, proveedor o artículo..."
          />
        </div>
        <select 
          onChange={(e) => setFiltroEstado(e.target.value)} 
          value={filtroEstado}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Enviada">Enviada</option>
          <option value="Cancelado">Cancelado</option>
          <option value="Finalizado">Finalizado</option>
        </select>
        {(busqueda || filtroEstado) && (
          <button 
            onClick={limpiarFiltros}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {ordenes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>
            {busqueda || filtroEstado 
              ? 'No se encontraron órdenes con los filtros aplicados' 
              : 'No hay órdenes de compra registradas'
            }
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
            Mostrando {ordenes.length} de {ordenesOriginales.length} órdenes
          </div>
          <TablaGenerica
            datos={ordenes.map((o) => ({
              ...o,
              acciones: (
                <>
                  <button 
                    disabled={o.estado !== 'Pendiente'} 
                    onClick={() => navigate(`/ordenes/editar/${o.id}`)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Editar
                  </button>
                  <button 
                    disabled={o.estado !== 'Pendiente'} 
                    onClick={() => navigate(`/ordenes/eliminar/${o.id}`)}
                  >
                    Eliminar
                  </button>
                </>
              )
            }))}
            columnas={[
              { header: "Referencia", render: (o: any) => <strong>{o.id}</strong> },
              { 
                header: "Estado", 
                render: (o: any) => (
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    backgroundColor: o.estado === 'Pendiente' ? '#fff3cd' : 
                                   o.estado === 'Enviada' ? '#d1ecf1' : 
                                   o.estado === 'Finalizado' ? '#d4edda' : '#f8d7da',
                    color: o.estado === 'Pendiente' ? '#856404' : 
                          o.estado === 'Enviada' ? '#0c5460' : 
                          o.estado === 'Finalizado' ? '#155724' : '#721c24'
                  }}>
                    {o.estado}
                  </span>
                )
              },
              { header: "Proveedor", render: (o: any) => o.proveedor },
              { header: "Nombre Artículo", render: (o: any) => o.articulo },
              { header: "Fecha creación", render: (o: any) => o.fecha },
              { header: "Monto", render: (o: any) => `$${o.monto.toLocaleString()}` },
              { header: "Acciones", render: (o: any) => o.acciones }
            ]}
          />
        </>
      )}
    </div>
  );
};

export default OrdenesCompra;