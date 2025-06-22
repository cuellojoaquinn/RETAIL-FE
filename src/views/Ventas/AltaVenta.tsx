// 📁 src/views/Ventas/AltaVenta.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '../../components/CampoText';
import FormularioSeccion from '../../components/FormularioSeccion';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';
import { MdInventory, MdShoppingCart } from 'react-icons/md';
import ventaService from '../../services/venta.service.real';
import articuloService from '../../services/articulo.service.real';

interface Articulo {
  id: number;
  codArticulo: number;
  nombre: string;
  descripcion: string;
  stockActual: number;
  costoVenta: number;
}

const AltaVenta = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  // Cargar artículos al montar el componente
  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await articuloService.findAll();
      setArticulos(response.content);
      
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error cargando artículos';
      setError(mensaje);
      console.error('Error cargando artículos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVenta = async () => {
    if (!articulo || cantidad <= 0) {
      setError('Debe seleccionar un artículo y una cantidad válida');
      return;
    }
    
    if (cantidad > articulo.stockActual) {
      setError(`Solo se pueden vender un máximo de ${articulo.stockActual} unidades`);
      return;
    }

    try {
      setGuardando(true);
      setError('');
      
      // Enviar solo articuloId y cantidad al backend
      await ventaService.saveVenta({
        articuloId: articulo.id,
        cantidad: cantidad
      });
      
      // Navegar de vuelta a la lista de ventas con mensaje de éxito
      navigate('/ventas', { 
        state: { 
          mensaje: `Venta realizada exitosamente: ${articulo.nombre} x${cantidad}` 
        } 
      });
      
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al realizar la venta';
      setError(mensaje);
      console.error('Error realizando venta:', err);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
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

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f5f6fc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>
          <span
            style={{ color: '#333', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/ventas')}
          >
            Ventas
          </span>{' '}
          &gt; Realizar venta
        </h1>
      </div>

      <FormularioSeccion titulo="Seleccionar artículo" icono={<MdInventory />}>
        <div style={{ marginBottom: '1rem' }}>
          <select 
            value={articulo?.id || ''} 
            onChange={(e) => {
              const art = articulos.find(a => a.id === Number(e.target.value));
              setArticulo(art || null);
              setCantidad(0); // Resetear cantidad al cambiar artículo
            }}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%', maxWidth: '300px' }}
          >
            <option value="">Seleccionar artículo</option>
            {articulos.map(art => (
              <option key={art.id} value={art.id}>
                {art.nombre} - Stock: {art.stockActual}
              </option>
            ))}
          </select>
        </div>
        
        {articulo && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <p><strong>Precio:</strong> ${articulo.costoVenta}</p>
              <p><strong>Unidades disponibles:</strong> {articulo.stockActual}</p>
              <p><strong>Descripción:</strong> {articulo.descripcion}</p>
            </div>
            <div>
              <CampoTexto
                label="Cantidad"
                name="cantidad"
                type="number"
                value={cantidad.toString()}
                onChange={(e) => setCantidad(Number(e.target.value))}
                placeholder="Ingrese cantidad"
              />
              <p><strong>Total:</strong> ${cantidad * articulo.costoVenta}</p>
            </div>
          </div>
        )}
      </FormularioSeccion>

      {error && (
        <div style={{ marginTop: '1rem' }}>
          <Notificacion mensaje={error} tipo="error" />
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <BotonAgregar 
          texto={guardando ? "Realizando venta..." : "Realizar venta"} 
          onClick={handleVenta}
          disabled={guardando}
        />
      </div>
    </div>
  );
};

export default AltaVenta;