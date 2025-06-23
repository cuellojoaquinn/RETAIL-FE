import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CampoTexto from '../../components/CampoText';
import CampoTextoArea from '../../components/CampoTextoArea';
import FormularioSeccion from '../../components/FormularioSeccion';
import BotonAgregar from '../../components/BotonAgregar';
import Notificacion from '../../components/Notificacion';
import proveedorService, { type Proveedor, type ArticuloProveedor } from '../../services/proveedor.service.real';
import articuloServiceReal, { type Articulo as ServiceArticulo } from '../../services/articulo.service.real';
import { MdEdit, MdArrowBack, MdAdd, MdDelete, MdSave, MdWarning } from 'react-icons/md';

interface FormularioProveedor {
  nombre: string;
  direccion: string;
  observaciones: string;
}

interface FormularioArticulo {
  demoraEntrega: number;
  precioUnitario: number;
  cargosPedido: number;
  tiempoRevision: number;
  tipoModelo: string;
}

const EditarProveedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [articulos, setArticulos] = useState<ArticuloProveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [mostrarModalBaja, setMostrarModalBaja] = useState(false);
  const [dandoDeBaja, setDandoDeBaja] = useState(false);
  const [articulosDisponibles, setArticulosDisponibles] = useState<ServiceArticulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ServiceArticulo | null>(null);
  const [mostrarSeccionAgregar, setMostrarSeccionAgregar] = useState(false);

  // Formulario del proveedor
  const [formProveedor, setFormProveedor] = useState<FormularioProveedor>({
    nombre: '',
    direccion: '',
    observaciones: ''
  });

  // Formularios de artículos
  const [formArticulos, setFormArticulos] = useState<{ [key: string]: FormularioArticulo }>({});

  // Función para convertir formato del backend al frontend
  const convertirTipoModeloBackendToFrontend = (tipoModelo: string): string => {
    
    switch (tipoModelo) {
      case 'LOTE_FIJO':
        return 'Lote fijo';
      case 'INTERVALO_FIJO':
        return 'Intervalo fijo';
      default:
        return tipoModelo;
    }
  };

  // Función para convertir formato del frontend al backend
  const convertirTipoModeloFrontendToBackend = (tipoModelo: string): string => {
    switch (tipoModelo) {
      case 'Lote fijo':
        return 'LOTE_FIJO';
      case 'Intervalo fijo':
        return 'INTERVALO_FIJO';
      default:
        return tipoModelo;
    }
  };

  useEffect(() => {
    if (id) {
      cargarProveedor();
      cargarArticulosDisponibles();
    }
  }, [id]);

  const cargarProveedor = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar información del proveedor
      const proveedorData = await proveedorService.findById(parseInt(id!));
      if (!proveedorData) {
        setError('Proveedor no encontrado');
        return;
      }
      
      setProveedor(proveedorData);
      setFormProveedor({
        nombre: proveedorData.nombre || '',
        direccion: proveedorData.direccion || '',
        observaciones: proveedorData.observaciones || ''
      });

      // Cargar artículos del proveedor
      const articulosData = await proveedorService.getArticulosPorProveedor(parseInt(id!));
      setArticulos(articulosData);
      
      // Inicializar formularios de artículos
      const formulariosArticulos: { [key: string]: FormularioArticulo } = {};
      articulosData.forEach(art => {
        const codArticulo = art.articuloId?.toString() || art.codigo || '';
        const tipoModeloConvertido = convertirTipoModeloBackendToFrontend(art.tipoModelo || '');
        
        
        formulariosArticulos[codArticulo] = {
          demoraEntrega: art.demoraEntrega || 0,
          precioUnitario: art.precioUnitario || art.precio || 0,
          cargosPedido: art.cargosPedido || 0,
          tiempoRevision: art.tiempoRevision || 0,
          tipoModelo: tipoModeloConvertido
        };
      });
      setFormArticulos(formulariosArticulos);
      
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error cargando el proveedor';
      setError(mensaje);
      console.error('Error cargando proveedor:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarArticulosDisponibles = async () => {
    try {
      const response = await articuloServiceReal.findArticulosAAsignar();
      setArticulosDisponibles(response);
    } catch (error) {
      console.error('Error cargando artículos disponibles:', error);
    }
  };

  const handleChangeProveedor = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormProveedor(prev => ({ ...prev, [name]: value }));
    
    if (errores[name]) {
      setErrores(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChangeArticulo = (codArticulo: string, campo: string, valor: any) => {
    setFormArticulos(prev => ({
      ...prev,
      [codArticulo]: {
        ...prev[codArticulo],
        [campo]: valor
      }
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores: { [key: string]: string } = {};
    
    if (!formProveedor.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) {
      setError('Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      setGuardando(true);
      setError('');
      
      // Preparar el payload con la misma estructura que AltaProveedor
      const payload = {
        nombre: formProveedor.nombre,
        direccion: formProveedor.direccion,
        observaciones: formProveedor.observaciones,
        proveedorArticulos: articulos.map(art => {
          const codArticulo = art.articuloId?.toString() || art.codigo || '';
          const formArticulo = formArticulos[codArticulo] || {};
          
          return {
            demoraEntrega: formArticulo.demoraEntrega || art.demoraEntrega || 0,
            precioUnitario: formArticulo.precioUnitario || art.precioUnitario || art.precio || 0,
            cargosPedido: formArticulo.cargosPedido || art.cargosPedido || 0,
            articulo: {
              id: art.articuloId || parseInt(art.codigo || '0'),
              nombre: art.nombreArticulo || art.nombre || 'Sin nombre',
              codArticulo: art.articuloId || parseInt(art.codigo || '0')
            },
            tiempoRevision: formArticulo.tiempoRevision || art.tiempoRevision || 0,
            tipoModelo: convertirTipoModeloFrontendToBackend(formArticulo.tipoModelo || art.tipoModelo || '')
          };
        })
      };

      // Actualizar proveedor con toda la información en una sola llamada
      await proveedorService.updateProveedor(parseInt(id!), payload);
      
      navigate('/proveedores', { 
        state: { 
          mensaje: `Proveedor "${formProveedor.nombre}" actualizado correctamente` 
        } 
      });
      
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al guardar los cambios';
      setError(mensaje);
      console.error('Error guardando proveedor:', err);
    } finally {
      setGuardando(false);
    }
  };

  const handleDarDeBaja = async () => {
    try {
      setDandoDeBaja(true);
      setError('');
      
      await proveedorService.darDeBaja(parseInt(id!));
      
      navigate('/proveedores', { 
        state: { 
          mensaje: `Proveedor "${proveedor?.nombre}" dado de baja correctamente` 
        } 
      });
      
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al dar de baja el proveedor';
      setError(mensaje);
      console.error('Error dando de baja proveedor:', err);
    } finally {
      setDandoDeBaja(false);
      setMostrarModalBaja(false);
    }
  };

  const handleAgregarArticulo = () => {
    if (articuloSeleccionado) {
      const yaExiste = articulos.find(a => 
        (a.articuloId && a.articuloId === articuloSeleccionado.id) || 
        (a.codigo && a.codigo === articuloSeleccionado.codArticulo.toString())
      );
      
      if (yaExiste) {
        setError('Este artículo ya está asignado al proveedor');
        return;
      }

      // Crear un nuevo artículo para el proveedor
      const nuevoArticulo: ArticuloProveedor = {
        articuloId: articuloSeleccionado.id,
        codigo: articuloSeleccionado.codArticulo.toString(),
        nombreArticulo: articuloSeleccionado.nombre,
        nombre: articuloSeleccionado.nombre,
        proveedorId: parseInt(id!),
        esPredeterminado: false,
        demoraEntrega: 0,
        precioUnitario: 0,
        precio: 0,
        cargosPedido: 0,
        tiempoRevision: 0,
        tipoModelo: ''
      };

      setArticulos(prev => [...prev, nuevoArticulo]);
      
      // Inicializar el formulario para el nuevo artículo
      const codArticulo = articuloSeleccionado.codArticulo.toString();
      setFormArticulos(prev => ({
        ...prev,
        [codArticulo]: {
          demoraEntrega: 0,
          precioUnitario: 0,
          cargosPedido: 0,
          tiempoRevision: 0,
          tipoModelo: ''
        }
      }));

      setArticuloSeleccionado(null);
      setError('');
      setMostrarSeccionAgregar(false);
    }
  };

  const eliminarArticulo = (codArticulo: string) => {
    // No permitir eliminar el último artículo
    if (articulos.length <= 1) {
      setError('Un proveedor debe tener al menos un artículo asociado.');
      // Opcional: limpiar el error después de un tiempo
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Filtrar para eliminar el artículo
    setArticulos(prev => prev.filter(art => {
      const id = art.articuloId?.toString() || art.codigo || '';
      return id !== codArticulo;
    }));
    
    // Eliminar también su formulario asociado
    setFormArticulos(prev => {
      const nuevosFormularios = { ...prev };
      delete nuevosFormularios[codArticulo];
      return nuevosFormularios;
    });
  };

  const articulosParaSeleccionar = articulosDisponibles.filter(art =>
    !articulos.find(articulo => 
      (articulo.articuloId && articulo.articuloId === art.id) || 
      (articulo.codigo && articulo.codigo === art.codArticulo.toString())
    )
  );

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
        <p>Cargando proveedor...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && !proveedor) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#dc3545'
      }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate("/proveedores")}
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
          Volver a Proveedores
        </button>
      </div>
    );
  }

  if (!proveedor) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center'
      }}>
        <p>No se encontró el proveedor</p>
        <button 
          onClick={() => navigate("/proveedores")}
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
          Volver a Proveedores
        </button>
      </div>
    );
  }

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
          &gt; Editar proveedor
        </h1>
      </div>

      {error && (
        <div style={{ marginBottom: '1rem' }}>
          <Notificacion mensaje={error} tipo="error" />
        </div>
      )}

      <FormularioSeccion titulo="Información del Proveedor" icono={<MdEdit />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <CampoTexto
            label="Nombre"
            name="nombre"
            value={formProveedor.nombre}
            onChange={handleChangeProveedor}
            placeholder="Ingrese nombre"
            error={errores.nombre}
            required
          />
          <CampoTexto
            label="Dirección"
            name="direccion"
            value={formProveedor.direccion}
            onChange={handleChangeProveedor}
            placeholder="Ingrese dirección"
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <CampoTextoArea
            label="Observaciones"
            name="observaciones"
            value={formProveedor.observaciones}
            onChange={handleChangeProveedor}
            placeholder="Observaciones adicionales"
          />
        </div>
      </FormularioSeccion>

      <FormularioSeccion titulo="Artículos del Proveedor" icono={<MdEdit />}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0 }}>Artículos asignados ({articulos.length})</h4>
          <button
            onClick={() => setMostrarSeccionAgregar(!mostrarSeccionAgregar)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}
          >
            <MdAdd />
            {mostrarSeccionAgregar ? 'Ocultar' : 'Agregar Artículo'}
          </button>
        </div>

        {/* Sección para agregar artículos */}
        {mostrarSeccionAgregar && (
          <div style={{ 
            marginBottom: '2rem', 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px', 
            border: '1px solid #dee2e6' 
          }}>
            <h5 style={{ margin: '0 0 1rem 0' }}>Agregar nuevo artículo</h5>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={articuloSeleccionado?.id || ''}
                onChange={(e) => setArticuloSeleccionado(articulosParaSeleccionar.find(a => a.id === Number(e.target.value)) || null)}
                style={{ 
                  padding: '0.5rem', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc', 
                  minWidth: '250px' 
                }}
              >
                <option value="">Seleccionar artículo</option>
                {articulosParaSeleccionar.map(art => (
                  <option key={art.id} value={art.id}>
                    {art.nombre} (Cod: {art.codArticulo})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAgregarArticulo}
                disabled={!articuloSeleccionado}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: articuloSeleccionado ? '#007bff' : '#ccc', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: articuloSeleccionado ? 'pointer' : 'not-allowed' 
                }}
              >
                Agregar
              </button>
            </div>
            {articulosParaSeleccionar.length === 0 && (
              <p style={{ color: '#666', fontStyle: 'italic', margin: '0.5rem 0 0 0' }}>
                No hay artículos disponibles para agregar
              </p>
            )}
          </div>
        )}

        {articulos.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <p style={{ color: '#6c757d', margin: 0 }}>
              Este proveedor no tiene artículos asignados.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {articulos.map(articulo => {
              const codArticulo = articulo.articuloId?.toString() || articulo.codigo || '';
              const nombreArticulo = articulo.nombreArticulo || articulo.nombre || 'Sin nombre';
              const tipoModeloValue = formArticulos[codArticulo]?.tipoModelo || '';
              
              
              return (
                <div key={codArticulo} style={{ 
                  border: '1px solid #dee2e6', 
                  borderRadius: '8px', 
                  padding: '1rem',
                  backgroundColor: 'white',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>
                      {nombreArticulo} ({codArticulo})
                    </h4>
                    <button
                      onClick={() => eliminarArticulo(codArticulo)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#dc3545',
                        padding: '0.25rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Eliminar artículo"
                    >
                      <MdDelete />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <CampoTexto
                      label="Precio unitario"
                      name="precioUnitario"
                      type="number"
                      value={(formArticulos[codArticulo]?.precioUnitario ?? 0).toString()}
                      onChange={(e) => handleChangeArticulo(codArticulo, 'precioUnitario', parseFloat(e.target.value))}
                      placeholder="0"
                    />
                    <CampoTexto
                      label="Demora entrega (días)"
                      name="demoraEntrega"
                      type="number"
                      value={(formArticulos[codArticulo]?.demoraEntrega ?? 0).toString()}
                      onChange={(e) => handleChangeArticulo(codArticulo, 'demoraEntrega', parseInt(e.target.value))}
                      placeholder="0"
                    />
                    <CampoTexto
                      label="Cargos por pedido"
                      name="cargosPedido"
                      type="number"
                      value={(formArticulos[codArticulo]?.cargosPedido ?? 0).toString()}
                      onChange={(e) => handleChangeArticulo(codArticulo, 'cargosPedido', parseFloat(e.target.value))}
                      placeholder="0"
                    />
                    <CampoTexto
                      label="Tiempo revisión (días)"
                      name="tiempoRevision"
                      type="number"
                      value={(formArticulos[codArticulo]?.tiempoRevision ?? 0).toString()}
                      onChange={(e) => handleChangeArticulo(codArticulo, 'tiempoRevision', parseInt(e.target.value))}
                      placeholder="0"
                    />
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Tipo de modelo
                      </label>
                      <select
                        value={tipoModeloValue}
                        onChange={(e) => handleChangeArticulo(codArticulo, 'tipoModelo', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="Lote fijo">Lote fijo</option>
                        <option value="Intervalo fijo">Intervalo fijo</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </FormularioSeccion>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => navigate('/proveedores')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <MdArrowBack /> Cancelar
        </button>
        <BotonAgregar 
          texto={guardando ? "Guardando..." : "Guardar cambios"} 
          onClick={handleGuardar}
          disabled={guardando}
          icono={<MdSave />}
        />
        <button
          onClick={() => setMostrarModalBaja(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <MdWarning /> Dar de Baja
        </button>
      </div>

      {/* Modal de confirmación de baja */}
      {mostrarModalBaja && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            maxWidth: '500px', 
            width: '90%' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <MdWarning style={{ color: '#dc3545', fontSize: '2rem' }} />
              <h3 style={{ margin: 0, color: '#dc3545' }}>Confirmar baja del proveedor</h3>
            </div>
            <p style={{ marginBottom: '1.5rem', lineHeight: '1.5' }}>
              ¿Está seguro que desea dar de baja al proveedor <strong>"{proveedor?.nombre}"</strong>?
            </p>
            <p style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '4px',
              color: '#856404'
            }}>
              <strong>⚠️ Advertencia:</strong> Esta acción marcará al proveedor como inactivo. 
              Los artículos asociados seguirán disponibles pero no se podrán realizar nuevas operaciones con este proveedor.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setMostrarModalBaja(false)}
                disabled={dandoDeBaja}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: dandoDeBaja ? 'not-allowed' : 'pointer',
                  opacity: dandoDeBaja ? 0.6 : 1
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleDarDeBaja}
                disabled={dandoDeBaja}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: dandoDeBaja ? 'not-allowed' : 'pointer',
                  opacity: dandoDeBaja ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {dandoDeBaja ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid #fff', 
                      borderTop: '2px solid transparent', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite'
                    }} />
                    Dando de baja...
                  </>
                ) : (
                  <>
                    <MdWarning />
                    Confirmar Baja
                  </>
                )}
              </button>
            </div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarProveedor; 