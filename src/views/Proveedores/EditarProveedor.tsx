// 📁 src/views/Proveedores/EditarProveedor.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CampoText from '../../components/CampoText';
import FormularioSeccion from '../../components/FormularioSeccion';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';

const articulosMock = {
  'A001': {
    nombre: 'Artículo A1',
    codArticulo: 'A001',
    costoAlmacenamiento: 50,
    demanda: 20,
    costoCompra: 200,
    descripcion: 'Artículo de ejemplo'
  }
};

const EditarProveedor = () => {
  const { idProveedor, codArticulo } = useParams();
  const navigate = useNavigate();

  const [articulo, setArticulo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const datos = articulosMock[codArticulo];
    if (datos) setArticulo(datos);
    else setError('No se encontró el artículo');
  }, [codArticulo]);

  const handleGuardar = () => {
    if (!articulo?.nombre || !articulo?.descripcion || articulo?.costoCompra <= 0 || articulo?.demanda <= 0) {
      setError('Complete todos los campos obligatorios con valores válidos');
      return;
    }
    navigate('/proveedores', { state: { mensaje: 'Artículo editado correctamente' } });
  };

  if (!articulo) return <p>Cargando artículo...</p>;

  return (
    <div className="contenedor">
      <h2>Editar artículo del proveedor</h2>
      <FormularioSeccion titulo={`Artículo: ${articulo.nombre}`}>
        <CampoText label="Nombre" value={articulo.nombre} onChange={(e) => setArticulo({ ...articulo, nombre: e.target.value })} />
        <CampoText label="Costo de almacenamiento" value={articulo.costoAlmacenamiento} onChange={(e) => setArticulo({ ...articulo, costoAlmacenamiento: Number(e.target.value) })} tipo="number" />
        <CampoText label="Demanda" value={articulo.demanda} onChange={(e) => setArticulo({ ...articulo, demanda: Number(e.target.value) })} tipo="number" />
        <CampoText label="Costo de compra" value={articulo.costoCompra} onChange={(e) => setArticulo({ ...articulo, costoCompra: Number(e.target.value) })} tipo="number" />
        <CampoText label="Descripción" value={articulo.descripcion} onChange={(e) => setArticulo({ ...articulo, descripcion: e.target.value })} />
      </FormularioSeccion>

      {error && <Notificacion mensaje={error} tipo="error" />}

      <BotonAgregar label="Guardar cambios" onClick={handleGuardar} />
    </div>
  );
};

export default EditarProveedor;