// 📁 src/views/Ventas/Ventas.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablaGenerica from '../../components/TablaGenerica';
import BotonAgregar from '../../components/BotonAgregar';
import ventaService from '../../services/venta.service.real';
import type { Venta } from '../../services/venta.service';
import { MdRefresh, MdWarning, MdShoppingCart, MdAttachMoney } from 'react-icons/md';

const Ventas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    completadas: 0,
    pendientes: 0,
    canceladas: 0,
    totalVentas: 0,
    promedioVenta: 0,
    ventasHoy: 0
  });

  const navigate = useNavigate();

  // Cargar ventas al montar el componente
  useEffect(() => {
    cargarVentas();
    cargarEstadisticas();
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

  const cargarEstadisticas = async () => {
    try {
      const stats = await ventaService.getEstadisticas();
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
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

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '1rem', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <MdShoppingCart style={{ color: '#1976d2', marginRight: '0.5rem' }} />
            <h3 style={{ margin: 0, color: '#1976d2' }}>Total Ventas</h3>
          </div>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{estadisticas.total}</p>
        </div>
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '1rem', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <MdAttachMoney style={{ color: '#2e7d32', marginRight: '0.5rem' }} />
            <h3 style={{ margin: 0, color: '#2e7d32' }}>Total Ingresos</h3>
          </div>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>${estadisticas.totalVentas.toLocaleString()}</p>
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
              render: (v: Venta) => <strong>{v.articulos[0]?.articuloNombre || 'N/A'}</strong> 
            },
            { 
              header: "Fecha", 
              render: (v: Venta) => {
                const fecha = new Date(v.fecha);
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
                  {v.articulos[0]?.cantidad || 0}
                </span>
              ) 
            },
            { 
              header: "Monto", 
              render: (v: Venta) => (
                <strong style={{ color: '#28a745' }}>
                  ${v.total.toLocaleString()}
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