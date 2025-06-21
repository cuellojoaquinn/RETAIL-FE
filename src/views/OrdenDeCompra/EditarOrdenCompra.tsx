// 📁 src/views/OrdenesCompra/EditarOrdenCompra.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CampoText from '../../components/CampoText';
import FormularioSeccion from '../../components/FormularioSeccion';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';
import Buscador from '../../components/Buscador';

const ordenesMock = {
  OC001: {
    id: 'OC001',
    estado: 'Pendiente',
    proveedor: 'Proveedor A',
    articulo: { id: 'A001', nombre: 'Artículo A1', precio: 100, puntoPedido: 5, tiempoEntrega: '5 días' },
    cantidad: 3
  }
};

const EditarOrdenCompra = () => {
  const { idOrden } = useParams();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ordenesMock[idOrden]) {
      setOrden(ordenesMock[idOrden]);
      setCantidad(ordenesMock[idOrden].cantidad);
    }
  }, [idOrden]);

  const handleGuardar = () => {
    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a cero.');
      return;
    }
    if (cantidad < orden.articulo.puntoPedido) {
      alert('Advertencia: La cantidad es menor al punto de pedido.');
    }
    navigate('/ordenes-compra', { state: { mensaje: 'Orden editada correctamente.' } });
  };

  if (!orden) return <p>Cargando orden...</p>;

  return (
    <div className="contenedor">
      <h2>Editar orden de compra #{orden.id}</h2>
      <FormularioSeccion titulo="Artículo">
        <p>{orden.articulo.nombre}</p>
        <p>Precio unitario: ${orden.articulo.precio}</p>
        <CampoText
          label="Cantidad a pedir"
          tipo="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />
        <p>Total: ${orden.articulo.precio * cantidad}</p>
      </FormularioSeccion>

      {error && <Notificacion mensaje={error} tipo="error" />}

      <BotonAgregar label="Guardar cambios" onClick={handleGuardar} />
    </div>
  );
};

export default EditarOrdenCompra;
