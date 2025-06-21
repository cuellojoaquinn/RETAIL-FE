// 📁 src/views/Ventas/AltaVenta.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '../../components/CampoText';
import FormularioSeccion from '../../components/FormularioSeccion';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';
import { MdInventory, MdShoppingCart } from 'react-icons/md';

interface Articulo {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
}

const articulosMock: Articulo[] = [
  { id: 'A001', nombre: 'Artículo A1', precio: 100, stock: 10 },
  { id: 'A002', nombre: 'Artículo A2', precio: 120, stock: 3 }
];

const AltaVenta = () => {
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVenta = () => {
    if (!articulo || cantidad <= 0) {
      setError('Debe seleccionar un artículo y una cantidad válida');
      return;
    }
    if (cantidad > articulo.stock) {
      setError(`Solo se pueden vender un máximo de ${articulo.stock} unidades`);
      return;
    }
    navigate('/ventas', { state: { mensaje: 'La venta se ha realizado exitosamente' } });
  };

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
              const art = articulosMock.find(a => a.id === e.target.value);
              setArticulo(art || null);
            }}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%', maxWidth: '300px' }}
          >
            <option value="">Seleccionar artículo</option>
            {articulosMock.map(art => (
              <option key={art.id} value={art.id}>{art.nombre}</option>
            ))}
          </select>
        </div>
        
        {articulo && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <p><strong>Precio:</strong> ${articulo.precio}</p>
              <p><strong>Unidades disponibles:</strong> {articulo.stock}</p>
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
              <p><strong>Total:</strong> ${cantidad * articulo.precio}</p>
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
        <BotonAgregar texto="Realizar venta" onClick={handleVenta} />
      </div>
    </div>
  );
};

export default AltaVenta;