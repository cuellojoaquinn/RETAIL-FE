// 📁 src/views/Proveedores/AltaProveedor.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '../../components/CampoText';
import FormularioSeccion from '../../components/FormularioSeccion';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';
import { MdPerson, MdInventory } from 'react-icons/md';

const articulosMock = [
  { id: 'A001', nombre: 'Artículo A1' },
  { id: 'A002', nombre: 'Artículo A2' }
];

const AltaProveedor = () => {
  const [proveedor, setProveedor] = useState({ nombre: '', direccion: '' });
  const [articulos, setArticulos] = useState<any[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProveedor(prev => ({ ...prev, [name]: value }));
  };

  const handleAgregarArticulo = () => {
    if (articuloSeleccionado) {
      setArticulos([...articulos, { ...articuloSeleccionado, tipoModelo: '', demoraEntrega: '', precio: 0 }]);
      setArticuloSeleccionado(null);
    }
  };

  const handleGuardarProveedor = () => {
    if (!proveedor.nombre || articulos.length === 0) {
      setError('Debe completar todos los campos y agregar al menos un artículo');
      return;
    }
    // Guardar mockeado
    navigate('/proveedores', { state: { mensaje: 'Se añadió el proveedor correctamente.' } });
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f5f6fc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>
          <span
            style={{ color: '#333', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/proveedores')}
          >
            Proveedores
          </span>{' '}
          &gt; Agregar proveedor
        </h1>
      </div>

      <FormularioSeccion titulo="Datos del proveedor" icono={<MdPerson />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <CampoTexto 
            label="Nombre" 
            name="nombre"
            value={proveedor.nombre} 
            onChange={handleChange}
            placeholder="Ingrese nombre del proveedor"
          />
          <CampoTexto 
            label="Dirección" 
            name="direccion"
            value={proveedor.direccion} 
            onChange={handleChange}
            placeholder="Ingrese dirección"
          />
        </div>
      </FormularioSeccion>

      <FormularioSeccion titulo="Artículos asociados" icono={<MdInventory />}>
        <div style={{ marginBottom: '1rem' }}>
          <select 
            value={articuloSeleccionado?.id || ''} 
            onChange={(e) => {
              const art = articulosMock.find(a => a.id === e.target.value);
              setArticuloSeleccionado(art || null);
            }}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', marginRight: '1rem' }}
          >
            <option value="">Seleccionar artículo</option>
            {articulosMock.map(art => (
              <option key={art.id} value={art.id}>{art.nombre}</option>
            ))}
          </select>
          <button 
            onClick={handleAgregarArticulo}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#5b3cc4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Agregar artículo
          </button>
        </div>
        
        {articulos.length > 0 && (
          <div>
            <h4>Artículos agregados:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {articulos.map((a, i) => (
                <li key={i} style={{ padding: '0.5rem', border: '1px solid #ccc', marginBottom: '0.5rem', borderRadius: '4px' }}>
                  {a.nombre} - {a.tipoModelo || 'Tipo no definido'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </FormularioSeccion>

      {error && (
        <div style={{ marginTop: '1rem' }}>
          <Notificacion mensaje={error} tipo="error" />
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <BotonAgregar texto="Añadir proveedor" onClick={handleGuardarProveedor} />
      </div>
    </div>
  );
};

export default AltaProveedor;
