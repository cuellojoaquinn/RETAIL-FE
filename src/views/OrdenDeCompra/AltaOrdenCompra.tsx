// 📁 src/views/OrdenesCompra/AltaOrdenCompra.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '../../components/CampoText';
import FormularioSeccion from '../../components/FormularioSeccion';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';
import { MdPerson, MdInventory, MdShoppingCart } from 'react-icons/md';

interface Proveedor {
  id: number;
  nombre: string;
  articulos: Articulo[];
}

interface Articulo {
  id: string;
  nombre: string;
  precio: number;
  puntoPedido: number;
  tiempoEntrega: string;
  predeterminado: boolean;
}

const proveedoresMock: Proveedor[] = [
  { 
    id: 1, 
    nombre: 'Proveedor A', 
    articulos: [
      { id: 'A001', nombre: 'Artículo A1', precio: 100, puntoPedido: 5, tiempoEntrega: '5 días', predeterminado: true },
      { id: 'A002', nombre: 'Artículo A2', precio: 120, puntoPedido: 10, tiempoEntrega: '3 días', predeterminado: false },
    ] 
  },
  { id: 2, nombre: 'Proveedor B', articulos: [] }
];

const AltaOrdenCompra = () => {
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCrearOrden = () => {
    if (!proveedor || !articulo || cantidad <= 0) {
      setError('Debe seleccionar proveedor, artículo y una cantidad válida.');
      return;
    }
    if (cantidad < articulo.puntoPedido) {
      alert('La cantidad es menor al punto de pedido.');
      return;
    }
    navigate('/ordenes', { state: { mensaje: 'Orden de compra creada exitosamente.' } });
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f5f6fc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>
          <span
            style={{ color: '#333', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/ordenes')}
          >
            Órdenes de compra
          </span>{' '}
          &gt; Crear orden de compra
        </h1>
      </div>

      <FormularioSeccion titulo="Proveedor" icono={<MdPerson />}>
        <div style={{ marginBottom: '1rem' }}>
          <select 
            value={proveedor?.id || ''} 
            onChange={(e) => {
              const prov = proveedoresMock.find(p => p.id === Number(e.target.value));
              setProveedor(prov || null);
              setArticulo(null);
            }}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%', maxWidth: '300px' }}
          >
            <option value="">Seleccionar proveedor</option>
            {proveedoresMock.map(prov => (
              <option key={prov.id} value={prov.id}>{prov.nombre}</option>
            ))}
          </select>
        </div>
        {!proveedor && <p>No hay proveedor seleccionado</p>}
      </FormularioSeccion>

      {proveedor && (
        <FormularioSeccion titulo="Artículo" icono={<MdInventory />}>
          <div style={{ marginBottom: '1rem' }}>
            <select 
              value={articulo?.id || ''} 
              onChange={(e) => {
                const art = proveedor.articulos.find(a => a.id === e.target.value);
                setArticulo(art || null);
              }}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%', maxWidth: '300px' }}
            >
              <option value="">Seleccionar artículo</option>
              {proveedor.articulos.map(art => (
                <option key={art.id} value={art.id}>{art.nombre}</option>
              ))}
            </select>
          </div>
        </FormularioSeccion>
      )}

      {articulo && (
        <FormularioSeccion titulo="Detalle del pedido" icono={<MdShoppingCart />}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <p><strong>Nombre:</strong> {articulo.nombre}</p>
              <p><strong>Precio:</strong> ${articulo.precio}</p>
              <p><strong>Punto de pedido:</strong> {articulo.puntoPedido}</p>
            </div>
            <div>
              <CampoTexto
                label="Cantidad a pedir"
                name="cantidad"
                type="number"
                value={cantidad.toString()}
                onChange={(e) => setCantidad(Number(e.target.value))}
                placeholder="Ingrese cantidad"
              />
              <p><strong>Total:</strong> ${articulo.precio * cantidad}</p>
              <p><strong>Tiempo estimado de entrega:</strong> {articulo.tiempoEntrega}</p>
            </div>
          </div>
        </FormularioSeccion>
      )}

      {error && (
        <div style={{ marginTop: '1rem' }}>
          <Notificacion mensaje={error} tipo="error" />
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <BotonAgregar texto="Crear orden de compra" onClick={handleCrearOrden} />
      </div>
    </div>
  );
};

export default AltaOrdenCompra;