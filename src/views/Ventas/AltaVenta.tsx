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

// Datos simulados de artículos disponibles
const articulosMock: Articulo[] = [
  {
    id: 'A001',
    nombre: 'Mouse Logitech G502 HERO',
    precio: 1500,
    stock: 50
  },
  {
    id: 'A002',
    nombre: 'Teclado Mecánico Corsair K70',
    precio: 3000,
    stock: 0
  },
  {
    id: 'A003',
    nombre: 'Monitor LED 24" Samsung FHD',
    precio: 25000,
    stock: 15
  },
  {
    id: 'A004',
    nombre: 'Auriculares Bluetooth Sony WH-1000XM4',
    precio: 8000,
    stock: 0
  },
  {
    id: 'A005',
    nombre: 'Webcam HD Logitech C920',
    precio: 12000,
    stock: 8
  },
  {
    id: 'A006',
    nombre: 'SSD 1TB Samsung 970 EVO Plus',
    precio: 9000,
    stock: 25
  },
  {
    id: 'A007',
    nombre: 'Memoria RAM 16GB Kingston Fury',
    precio: 12000,
    stock: 40
  },
  {
    id: 'A008',
    nombre: 'Impresora Láser HP LaserJet Pro',
    precio: 90000,
    stock: 3
  },
  {
    id: 'A009',
    nombre: 'Fuente de Poder 750W EVGA',
    precio: 13500,
    stock: 12
  },
  {
    id: 'A010',
    nombre: 'Placa de Video RTX 4060 MSI',
    precio: 400000,
    stock: 2
  },
  {
    id: 'A011',
    nombre: 'Disco Duro 2TB Seagate Barracuda',
    precio: 7500,
    stock: 18
  },
  {
    id: 'A012',
    nombre: 'Router WiFi TP-Link Archer C7',
    precio: 15000,
    stock: 6
  },
  {
    id: 'A013',
    nombre: 'Micrófono USB Blue Yeti',
    precio: 25000,
    stock: 4
  },
  {
    id: 'A014',
    nombre: 'Tablet Samsung Galaxy Tab S7',
    precio: 180000,
    stock: 7
  },
  {
    id: 'A015',
    nombre: 'Cable HDMI 2.0 2m Premium',
    precio: 800,
    stock: 100
  },
  {
    id: 'A016',
    nombre: 'Laptop Dell Inspiron 15 3000',
    precio: 350000,
    stock: 5
  },
  {
    id: 'A017',
    nombre: 'Mouse Pad Gaming RGB',
    precio: 2500,
    stock: 0
  },
  {
    id: 'A018',
    nombre: 'Teclado Numérico USB',
    precio: 1800,
    stock: 22
  },
  {
    id: 'A019',
    nombre: 'Monitor 27" 4K LG UltraFine',
    precio: 450000,
    stock: 1
  },
  {
    id: 'A020',
    nombre: 'Auriculares Gaming Razer Kraken',
    precio: 18000,
    stock: 9
  }
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