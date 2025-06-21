// 📁 src/views/OrdenesCompra/EliminarOrdenCompra.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Notificacion from '../../components/Notificacion';

const EliminarOrdenCompra = () => {
  const { idOrden } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleEliminar = () => {
    const estadoMock = 'Pendiente'; // Simular búsqueda del estado
    if (estadoMock !== 'Pendiente') {
      setError('Solo se puede eliminar una orden con estado Pendiente.');
      return;
    }

    // Simulación de éxito
    navigate('/ordenes-compra', { state: { mensaje: `Orden ${idOrden} eliminada correctamente.` } });
  };

  return (
    <div className="contenedor">
      <h2>¿Estás seguro que deseas eliminar la orden de compra #{idOrden}?</h2>
      {error && <Notificacion mensaje={error} tipo="error" />}
      <button onClick={() => navigate('/ordenes-compra')}>Cancelar</button>
      <button onClick={handleEliminar}>Aceptar</button>
    </div>
  );
};

export default EliminarOrdenCompra;
