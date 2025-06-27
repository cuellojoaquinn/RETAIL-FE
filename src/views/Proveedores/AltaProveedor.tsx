// 📁 src/views/Proveedores/AltaProveedor.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CampoTexto from '../../components/CampoText';
import FormularioSeccion from '../../components/FormularioSeccion';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';
import { MdPerson, MdInventory, MdStar, MdStarBorder, MdDelete, MdSettings } from 'react-icons/md';
import proveedorServiceReal from '../../services/proveedor.service.real';
import articuloServiceReal, { type Articulo as ServiceArticulo } from '../../services/articulo.service.real';

interface FormArticulo {
  id: number;
  codArticulo: number;
  nombre: string;
  esPredeterminado: boolean;
  tipoModelo: 'Lote Fijo' | 'Intervalo Fijo' | '';
  demoraEntrega: string;
  precioUnitario: string;
  cargosPedido: string;
  tiempoRevision: string;
}

const AltaProveedor = () => {
  const [proveedor, setProveedor] = useState({ nombre: '' });
  const [articulos, setArticulos] = useState<FormArticulo[]>([]);
  const [articulosDisponibles, setArticulosDisponibles] = useState<ServiceArticulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ServiceArticulo | null>(null);
  const [error, setError] = useState('');
  const [erroresArticulos, setErroresArticulos] = useState<{ [id: string]: { [field: string]: boolean } }>({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true);
        const response = await articuloServiceReal.findArticulosAAsignar();
        setArticulosDisponibles(response);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los artículos');
        setLoading(false);
      }
    };
    fetchArticulos();
  }, []);

  // Validación en tiempo real del formulario
  const formularioValido = useMemo(() => {
    // Validar información del proveedor
    if (!proveedor.nombre.trim()) {
      return false;
    }

    // Validar que haya al menos un artículo
    if (articulos.length === 0) {
      return false;
    }

    // Validar que todos los artículos tengan información completa
    for (const articulo of articulos) {
      // Validar tipo de modelo
      if (!articulo.tipoModelo) {
        return false;
      }

      // Validar demora de entrega (debe ser un número positivo)
      if (!articulo.demoraEntrega || isNaN(Number(articulo.demoraEntrega)) || Number(articulo.demoraEntrega) <= 0) {
        return false;
      }

      // Validar precio unitario (debe ser un número positivo)
      if (!articulo.precioUnitario || isNaN(Number(articulo.precioUnitario)) || Number(articulo.precioUnitario) <= 0) {
        return false;
      }

      // Validar cargos de pedido (debe ser un número no negativo)
      if (!articulo.cargosPedido || isNaN(Number(articulo.cargosPedido)) || Number(articulo.cargosPedido) < 0) {
        return false;
      }

      // Validar tiempo de revisión (debe ser un número positivo, excepto para Lote Fijo)
      if (articulo.tipoModelo !== 'Lote Fijo' && (!articulo.tiempoRevision || isNaN(Number(articulo.tiempoRevision)) || Number(articulo.tiempoRevision) <= 0)) {
        return false;
      }
    }

    return true;
  }, [proveedor.nombre, articulos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProveedor(prev => ({ ...prev, [name]: value }));
    // Limpiar error al corregir
    if (error && name === 'nombre' && value.trim()) {
      setError('');
    }
  };

  const handleAgregarArticulo = () => {
    if (articuloSeleccionado) {
      const yaExiste = articulos.find(a => a.id === articuloSeleccionado.id);
      if (yaExiste) {
        setError('Este artículo ya está agregado');
        return;
      }
      setArticulos([...articulos, {
        id: articuloSeleccionado.id,
        codArticulo: articuloSeleccionado.codArticulo,
        nombre: articuloSeleccionado.nombre,
        esPredeterminado: false,
        tipoModelo: '',
        demoraEntrega: '',
        precioUnitario: '',
        cargosPedido: '',
        tiempoRevision: '',
      }]);
      setArticuloSeleccionado(null);
      setError('');
    }
  };
  
  const handleArticuloChange = (id: number, field: keyof FormArticulo, value: any) => {
    setArticulos(prev => prev.map(art => 
      art.id === id ? { ...art, [field]: value } : art
    ));
    
    // Si se cambia el tipo de modelo a "Lote Fijo", establecer tiempo de revisión como "0"
    if (field === 'tipoModelo' && value === 'Lote Fijo') {
      setArticulos(prev => prev.map(art => 
        art.id === id ? { ...art, tiempoRevision: '0' } : art
      ));
    }
    
    // Limpiar errores al corregir
    if (erroresArticulos[String(id)] && erroresArticulos[String(id)][field]) {
      setErroresArticulos(prev => {
        const newErrors = { ...prev };
        delete newErrors[String(id)][field];
        if (Object.keys(newErrors[String(id)]).length === 0) {
          delete newErrors[String(id)];
        }
        return newErrors;
      });
    }
  };

  const togglePredeterminado = (articuloId: number) => {
    setArticulos(prev => prev.map(art =>
      art.id === articuloId ? { ...art, esPredeterminado: !art.esPredeterminado } : art
    ));
  };

  const eliminarArticulo = (articuloId: number) => {
    setArticulos(prev => prev.filter(art => art.id !== articuloId));
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: { [id: string]: { [field: string]: boolean } } = {};
    let formValido = true;

    for (const art of articulos) {
      const erroresArt: { [field: string]: boolean } = {};
      if (!art.tipoModelo) {
        erroresArt.tipoModelo = true;
        formValido = false;
      }
      if (!art.demoraEntrega || isNaN(Number(art.demoraEntrega)) || Number(art.demoraEntrega) <= 0) {
        erroresArt.demoraEntrega = true;
        formValido = false;
      }
      if (!art.precioUnitario || isNaN(Number(art.precioUnitario)) || Number(art.precioUnitario) <= 0) {
        erroresArt.precioUnitario = true;
        formValido = false;
      }
      if (!art.cargosPedido || isNaN(Number(art.cargosPedido)) || Number(art.cargosPedido) < 0) {
        erroresArt.cargosPedido = true;
        formValido = false;
      }
       if (art.tipoModelo !== 'Lote Fijo' && (!art.tiempoRevision || isNaN(Number(art.tiempoRevision)) || Number(art.tiempoRevision) <= 0)) {
        erroresArt.tiempoRevision = true;
        formValido = false;
      }
      if (Object.keys(erroresArt).length > 0) {
        nuevosErrores[String(art.id)] = erroresArt;
      }
    }

    setErroresArticulos(nuevosErrores);
    return formValido;
  }

  const handleGuardarProveedor = async () => {
    if (!formularioValido) {
      if (!proveedor.nombre.trim()) {
        setError('Debe completar el nombre del proveedor');
        return;
      }
      if (articulos.length === 0) {
        setError('Debe agregar al menos un artículo');
        return;
      }
      if (!validarFormulario()) {
        setError('Complete todos los campos de los artículos con formatos válidos');
        return;
      }
      return;
    }

    setLoading(true);

    const payload = {
      nombre: proveedor.nombre,
      proveedorArticulos: articulos.map(art => ({
        demoraEntrega: Number(art.demoraEntrega),
        precioUnitario: Number(art.precioUnitario),
        cargosPedido: Number(art.cargosPedido),
        articulo: {
          id: art.id,
          nombre: art.nombre,
          codArticulo: art.codArticulo
        },
        tiempoRevision: Number(art.tiempoRevision),
        tipoModelo: art.tipoModelo === 'Lote Fijo' ? 'LOTE_FIJO' : 'INTERVALO_FIJO'
      }))
    };

    try {
      await proveedorServiceReal.createProveedorWithArticulos(payload);
      setLoading(false);
      navigate('/proveedores', { state: { mensaje: 'Se añadió el proveedor correctamente.' } });
    } catch (err) {
      setError('Error al crear el proveedor. Intente nuevamente.');
      setLoading(false);
      console.error(err);
    }
  };

  const articulosParaSeleccionar = articulosDisponibles.filter(art =>
    !articulos.find(agregado => agregado.id === art.id)
  );

  // Contador de artículos completos
  const articulosCompletos = articulos.filter(art => {
    const camposBasicos = art.tipoModelo && 
      art.demoraEntrega && 
      art.precioUnitario && 
      art.cargosPedido &&
      !isNaN(Number(art.demoraEntrega)) && Number(art.demoraEntrega) > 0 &&
      !isNaN(Number(art.precioUnitario)) && Number(art.precioUnitario) > 0 &&
      !isNaN(Number(art.cargosPedido)) && Number(art.cargosPedido) >= 0;
    
    // Para Lote Fijo, no validar tiempo de revisión
    if (art.tipoModelo === 'Lote Fijo') {
      return camposBasicos;
    }
    
    // Para Intervalo Fijo, validar tiempo de revisión
    return camposBasicos && 
      art.tiempoRevision &&
      !isNaN(Number(art.tiempoRevision)) && Number(art.tiempoRevision) > 0;
  }).length;

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>
          <span style={{ color: '#333', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/proveedores')}>
            Proveedores
          </span> &gt; Agregar proveedor
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
            error={!proveedor.nombre.trim() && articulos.length > 0}
          />
        </div>
      </FormularioSeccion>

      <FormularioSeccion titulo="Artículos asociados" icono={<MdInventory />}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={articuloSeleccionado?.id || ''}
              onChange={(e) => setArticuloSeleccionado(articulosDisponibles.find(a => a.id === Number(e.target.value)) || null)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
            >
              <option value="">Seleccionar artículo</option>
              {articulosParaSeleccionar.map(art => <option key={art.id} value={art.id}>{art.nombre} (Cod: {art.codArticulo})</option>)}
            </select>
            <button
              onClick={handleAgregarArticulo}
              disabled={!articuloSeleccionado}
              style={{ padding: '0.5rem 1rem', backgroundColor: articuloSeleccionado ? '#5b3cc4' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: articuloSeleccionado ? 'pointer' : 'not-allowed' }}
            >
              Agregar artículo
            </button>
          </div>
          {loading && <p>Cargando artículos...</p>}
          {articulosParaSeleccionar.length === 0 && !loading && <p style={{ color: '#666', fontStyle: 'italic', marginTop: '0.5rem' }}>Todos los artículos disponibles han sido agregados</p>}
        </div>

        {articulos.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
              <MdSettings style={{ color: '#5b3cc4' }} />
              <h4 style={{ margin: 0 }}>Configuración de artículos</h4>
              <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: 'auto' }}>
                {articulosCompletos} de {articulos.length} artículos completos
              </span>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {articulos.map((articulo) => (
                <div key={articulo.id} style={{ border: erroresArticulos[String(articulo.id)] ? '1px solid #dc3545' : (articulo.esPredeterminado ? '2px solid #FDD36D' : '1px solid #ddd'), borderRadius: '8px', backgroundColor: articulo.esPredeterminado ? '#FFFBF0' : 'white', transition: 'all 0.2s ease' }}>
                  <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                    <button onClick={() => togglePredeterminado(articulo.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', marginRight: '1rem' }} title={articulo.esPredeterminado ? 'Quitar como predeterminado' : 'Marcar como predeterminado'}>
                      {articulo.esPredeterminado ? <MdStar style={{ color: '#FDD36D', fontSize: '1.5rem' }} /> : <MdStarBorder style={{ color: '#ccc', fontSize: '1.5rem' }} />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <strong>{articulo.nombre}</strong>
                      {articulo.esPredeterminado && <span style={{ backgroundColor: '#FDD36D', color: '#8B4513', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>PREDETERMINADO</span>}
                    </div>
                    <button onClick={() => eliminarArticulo(articulo.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#dc3545' }} title="Eliminar artículo"><MdDelete /></button>
                  </div>
                  <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tipo de modelo</label>
                      <select value={articulo.tipoModelo} onChange={(e) => handleArticuloChange(articulo.id, 'tipoModelo', e.target.value as FormArticulo['tipoModelo'])} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: erroresArticulos[String(articulo.id)]?.tipoModelo ? '1px solid #dc3545' : '1px solid #ccc' }}>
                        <option value="">Seleccionar</option>
                        <option value="Lote Fijo">Lote Fijo</option>
                        <option value="Intervalo Fijo">Intervalo Fijo</option>
                      </select>
                    </div>

                    <CampoTexto label="Demora de entrega (días)" name="demoraEntrega" value={articulo.demoraEntrega} onChange={(e) => handleArticuloChange(articulo.id, 'demoraEntrega', e.target.value)} type="number" error={erroresArticulos[String(articulo.id)]?.demoraEntrega} />
                    <CampoTexto label="Precio unitario ($)" name="precioUnitario" value={articulo.precioUnitario} onChange={(e) => handleArticuloChange(articulo.id, 'precioUnitario', e.target.value)} type="number" error={erroresArticulos[String(articulo.id)]?.precioUnitario} />
                    <CampoTexto label="Cargos de pedido ($)" name="cargosPedido" value={articulo.cargosPedido} onChange={(e) => handleArticuloChange(articulo.id, 'cargosPedido', e.target.value)} type="number" error={erroresArticulos[String(articulo.id)]?.cargosPedido} />
                    {articulo.tipoModelo !== 'Lote Fijo' && (
                      <CampoTexto label="Tiempo de revisión (días)" name="tiempoRevision" value={articulo.tiempoRevision} onChange={(e) => handleArticuloChange(articulo.id, 'tiempoRevision', e.target.value)} type="number" error={erroresArticulos[String(articulo.id)]?.tiempoRevision} />
                    )}
                  
                  </div>
                </div>
              ))}
            </div>
            {articulos.some(art => art.esPredeterminado) && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FFF8E1', border: '1px solid #FDD36D', borderRadius: '8px', color: '#8B4513' }}>
                <strong>✓ Proveedor predeterminado configurado</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>{articulos.filter(art => art.esPredeterminado).length} artículo(s) marcado(s) como predeterminado</p>
              </div>
            )}
          </div>
        )}
      </FormularioSeccion>

      {error && <div style={{ marginTop: '1rem' }}><Notificacion mensaje={error} tipo="error" /></div>}

      <div style={{ marginTop: '2rem' }}>
        <BotonAgregar 
          texto="Añadir proveedor" 
          onClick={handleGuardarProveedor} 
          disabled={!formularioValido || loading}
        />
        {!formularioValido && articulos.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            <p>Para habilitar el botón, complete:</p>
            <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
              {!proveedor.nombre.trim() && <li>Nombre del proveedor</li>}
              {articulosCompletos < articulos.length && <li>Todos los campos de los artículos ({articulosCompletos}/{articulos.length} completos)</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AltaProveedor;
