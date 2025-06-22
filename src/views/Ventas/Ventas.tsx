// 📁 src/views/Ventas/Ventas.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablaGenerica from '../../components/TablaGenerica';
import BotonAgregar from '../../components/BotonAgregar';
import ventaService from '../../services/venta.service.real';
import { MdRefresh, MdWarning, MdShoppingCart } from 'react-icons/md';

// Tipo Venta según la respuesta real del backend
export interface Venta {
  id: number;
  fechaVenta: string;
  articulo: {
    id: number;
    codArticulo: number;
    nombre: string;
    descripcion: string;
    produccionDiaria: number;
    demandaArticulo: number;
    costoAlmacenamiento: number;
    costoVenta: number;
    fechaBajaArticulo: string | null;
    puntoPedido: number;
    stockSeguridad: number;
    inventarioMaximo: number;
    loteOptimo: number;
    stockActual: number;
    z: number;
    desviacionEstandar: number;
    proveedorPredeterminado: number | null;
    cgi: number;
  };
  cantidad: number;
  montoTotal: number;
}

const Ventas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Cargar ventas al montar el componente
  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ventasData = await ventaService.findAll();
      setVentas(ventasData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando ventas');
      console.error('Error cargando ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = () => {
    navigate('/ventas/alta');
  };

  if (loading && ventas.length === 0) {
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
        <p>Cargando ventas...</p>
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
          onClick={cargarVentas}
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
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Ventas</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={cargarVentas}
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
          <BotonAgregar texto="Realizar venta" onClick={handleAgregar} />
        </div>
      </div>

      {ventas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <MdShoppingCart style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }} />
          <p>No se encontraron ventas</p>
        </div>
      ) : (
        <TablaGenerica
          datos={ventas}
          columnas={[
            { 
              header: "ID", 
              render: (v: Venta) => <strong>#{v.id}</strong> 
            },
            { 
              header: "Artículo", 
              render: (v: Venta) => <strong>{v.articulo?.nombre || 'N/A'}</strong> 
            },
            { 
              header: "Fecha", 
              render: (v: Venta) => {
                const fecha = new Date(v.fechaVenta);
                return fecha.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });
              } 
            },
            { 
              header: "Cantidad", 
              render: (v: Venta) => (
                <span style={{ 
                  backgroundColor: '#e3f2fd', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '12px', 
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {v.cantidad}
                </span>
              ) 
            },
            { 
              header: "Monto", 
              render: (v: Venta) => (
                <strong style={{ color: '#28a745' }}>
                  ${v.montoTotal?.toLocaleString() ?? 0}
                </strong>
              ) 
            }
          ]}
        />
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

export default Ventas;