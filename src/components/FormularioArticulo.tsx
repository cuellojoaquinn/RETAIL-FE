import { useEffect, useState } from "react";
import { MdArticle, MdPerson, MdInventory, MdTrendingUp, MdAttachMoney } from "react-icons/md";
import CampoTexto from "../components/CampoText";
import CampoTextoArea from "../components/CampoTextoArea";
import FormularioSeccion from "../components/FormularioSeccion";
import BotonAgregar from "../components/BotonAgregar";
import Notificacion from "../components/Notificacion";
import "../styles/ProveedorPredeterminado.css";
import { FaSave } from "react-icons/fa";
import proveedorService, { type ProveedorBackend } from "../services/proveedor.service.real";
import articuloServiceReal from "../services/articulo.service.real";

interface ArticuloForm {
  codigo: string;
  nombre: string;
  descripcion?: string;
  costoAlmacenamiento: string;
  demandaArticulo: string;
  costoVenta: string;
  stockActual: string;
  produccionDiaria: string;
  z: string;
  desviacionEstandar: string;
  proveedorPredeterminado?: string;
}

interface Props {
  modo: "alta" | "edicion";
  datosIniciales?: any;
  onGuardar: (articulo: ArticuloForm) => void;
}

const FormularioArticulo = ({ modo, datosIniciales, onGuardar }: Props) => {
  const [form, setForm] = useState<ArticuloForm>({
    codigo: "",
    nombre: "",
    descripcion: "",
    costoAlmacenamiento: "",
    demandaArticulo: "",
    costoVenta: "",
    stockActual: "",
    produccionDiaria: "",
    z: "",
    desviacionEstandar: "",
    proveedorPredeterminado: "",
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [mensajeGlobalError, setMensajeGlobalError] = useState<string | null>(null);
  const [proveedores, setProveedores] = useState<ProveedorBackend[]>([]);
  const [cargandoProveedores, setCargandoProveedores] = useState(false);
  const [actualizandoProveedor, setActualizandoProveedor] = useState(false);

  useEffect(() => {
    if (datosIniciales) {
      console.log('Datos iniciales recibidos:', datosIniciales);
      console.log('Proveedor predeterminado del artículo:', datosIniciales.proveedorPredeterminado);
      console.log('Tipo de proveedorPredeterminado:', typeof datosIniciales.proveedorPredeterminado);
      
      const proveedorPredeterminadoValue = datosIniciales.proveedorPredeterminado?.toString() || "";
      console.log('Valor convertido a string:', proveedorPredeterminadoValue);
      
      setForm({
        codigo: datosIniciales.codArticulo?.toString() || "",
        nombre: datosIniciales.nombre || "",
        descripcion: datosIniciales.descripcion || "",
        costoAlmacenamiento: datosIniciales.costoAlmacenamiento?.toString() || "",
        demandaArticulo: datosIniciales.demandaArticulo?.toString() || "",
        costoVenta: datosIniciales.costoVenta?.toString() || "",
        stockActual: datosIniciales.stockActual?.toString() || "",
        produccionDiaria: datosIniciales.produccionDiaria?.toString() || "",
        z: datosIniciales.z?.toString() || "",
        desviacionEstandar: datosIniciales.desviacionEstandar?.toString() || "",
        proveedorPredeterminado: proveedorPredeterminadoValue,
      });
    }
  }, [datosIniciales]);

  useEffect(() => {
    if (modo === 'edicion' && datosIniciales?.proveedorPredeterminado !== null) {
      console.log('Modo edición detectado con proveedor predeterminado, cargando proveedores...');
      cargarProveedores();
    } else if (modo === 'edicion') {
      console.log('Modo edición detectado sin proveedor predeterminado, no cargando proveedores');
    }
  }, [modo, datosIniciales?.proveedorPredeterminado]);

  useEffect(() => {
    if (modo === 'edicion') {
      console.log('Estado actual del formulario:', {
        proveedores: proveedores.length,
        cargandoProveedores,
        formProveedorPredeterminado: form.proveedorPredeterminado,
        proveedoresData: proveedores.map(p => ({ id: p.id, nombre: p.nombre })),
        proveedorSeleccionadoExiste: proveedores.some(p => p.id.toString() === form.proveedorPredeterminado)
      });
    }
  }, [modo, proveedores, cargandoProveedores, form.proveedorPredeterminado]);

  // Efecto para asegurar que el proveedor predeterminado se seleccione cuando se cargan los proveedores
  useEffect(() => {
    if (modo === 'edicion' && !cargandoProveedores && proveedores.length > 0 && datosIniciales?.proveedorPredeterminado !== null) {
      console.log('Verificando selección de proveedor predeterminado...');
      console.log('Datos iniciales proveedorPredeterminado:', datosIniciales.proveedorPredeterminado);
      console.log('Form actual proveedorPredeterminado:', form.proveedorPredeterminado);
      
      const proveedorPredeterminadoValue = datosIniciales.proveedorPredeterminado.toString();
      const proveedorExiste = proveedores.some(p => p.id.toString() === proveedorPredeterminadoValue);
      
      console.log('Proveedor existe en la lista:', proveedorExiste);
      
      if (proveedorExiste && form.proveedorPredeterminado !== proveedorPredeterminadoValue) {
        console.log('Actualizando proveedor predeterminado en el formulario...');
        setForm(prev => ({
          ...prev,
          proveedorPredeterminado: proveedorPredeterminadoValue
        }));
      }
    }
  }, [modo, cargandoProveedores, proveedores, datosIniciales, form.proveedorPredeterminado]);

  const cargarProveedores = async () => {
    try {
      setCargandoProveedores(true);
      console.log('Iniciando carga de proveedores...');
      const proveedoresData = await proveedorService.findAll();
      console.log('Proveedores cargados:', proveedoresData);
      // No filtrar por activo ya que el backend no devuelve ese campo
      setProveedores(proveedoresData);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
      setMensajeGlobalError('Error cargando la lista de proveedores');
    } finally {
      setCargandoProveedores(false);
    }
  };

  const actualizarProveedorPredeterminado = async (proveedorId: number) => {
    try {
      setActualizandoProveedor(true);
      console.log('Actualizando proveedor predeterminado a:', proveedorId);
      
      const articuloId = parseInt(datosIniciales.id);
      const resultado = await articuloServiceReal.setProveedorPredeterminado(articuloId, proveedorId);
      
      console.log('Proveedor predeterminado actualizado exitosamente:', resultado);
      setMensajeGlobalError(null);
    } catch (error) {
      console.error('Error actualizando proveedor predeterminado:', error);
      setMensajeGlobalError('Error actualizando el proveedor predeterminado');
    } finally {
      setActualizandoProveedor(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Si cambió el proveedor predeterminado, actualizar en el backend
    if (name === 'proveedorPredeterminado' && modo === 'edicion') {
      const proveedorId = value ? parseInt(value) : null;
      if (proveedorId) {
        actualizarProveedorPredeterminado(proveedorId);
      }
    }
    
    if (errores[name]) {
      setErrores((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores: { [key: string]: string } = {};
    if (modo === 'alta' && !form.codigo) nuevosErrores.codigo = "El código es requerido.";
    if (!form.nombre) nuevosErrores.nombre = "El nombre es requerido.";
    if (!form.costoAlmacenamiento) nuevosErrores.costoAlmacenamiento = "El costo es requerido.";
    if (!form.demandaArticulo) nuevosErrores.demandaArticulo = "La demanda es requerida.";
    if (!form.costoVenta) nuevosErrores.costoVenta = "El costo de venta es requerido.";
    if (!form.stockActual) nuevosErrores.stockActual = "El stock es requerido.";
    if (!form.produccionDiaria) nuevosErrores.produccionDiaria = "La producción es requerida.";
    if (!form.z) nuevosErrores.z = "El valor Z es requerido.";
    if (!form.desviacionEstandar) nuevosErrores.desviacionEstandar = "La desviación es requerida.";
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = () => {
    setMensajeGlobalError(null);
    if (!validarFormulario()) {
      setMensajeGlobalError("Por favor, corrija los errores en el formulario.");
      return;
    }
    onGuardar(form);
  };

  return (
    <div className="formulario-articulo-container">
      {mensajeGlobalError && (
        <div style={{ marginBottom: 16 }}>
          <Notificacion tipo='error' mensaje={mensajeGlobalError} />
        </div>
      )}

      <FormularioSeccion icono={<MdArticle />} titulo='Información General'>
        <div className='formulario-grid'>
          <CampoTexto label='Código' name='codigo' value={form.codigo} onChange={handleChange} placeholder='Ingrese código' required disabled={modo === 'edicion'} error={errores.codigo} />
          <CampoTexto label='Nombre' name='nombre' value={form.nombre} onChange={handleChange} placeholder='Ingrese nombre' required error={errores.nombre} />
          <CampoTextoArea label='Descripción' name='descripcion' value={form.descripcion || ""} onChange={handleChange} placeholder='Descripción del artículo' />
        </div>
      </FormularioSeccion>
      
      <FormularioSeccion icono={<MdAttachMoney />} titulo='Costos y Precios'>
        <div className='formulario-grid'>
          <CampoTexto label='Costo de Almacenamiento' name='costoAlmacenamiento' type='number' value={form.costoAlmacenamiento} onChange={handleChange} placeholder='Ingrese costo' required error={errores.costoAlmacenamiento} />
          <CampoTexto label='Costo de Venta' name='costoVenta' type='number' value={form.costoVenta} onChange={handleChange} placeholder='Ingrese costo' required error={errores.costoVenta} />
        </div>
      </FormularioSeccion>
      
      <FormularioSeccion icono={<MdInventory />} titulo='Gestión de Inventario'>
        <div className='formulario-grid'>
          <CampoTexto label='Stock Actual' name='stockActual' type='number' value={form.stockActual} onChange={handleChange} placeholder='Ingrese stock' required error={errores.stockActual} />
          <CampoTexto label='Demanda Diaria' name='demandaArticulo' type='number' value={form.demandaArticulo} onChange={handleChange} placeholder='Ingrese demanda' required error={errores.demandaArticulo} />
          <CampoTexto label='Producción Diaria' name='produccionDiaria' type='number' value={form.produccionDiaria} onChange={handleChange} placeholder='Ingrese producción' required error={errores.produccionDiaria} />
        </div>
      </FormularioSeccion>
      
      <FormularioSeccion icono={<MdTrendingUp />} titulo='Parámetros de Modelo de Inventario'>
        <div className='formulario-grid'>
          <CampoTexto label='Nivel de Confianza (Z)' name='z' type='number' value={form.z} onChange={handleChange} placeholder='Ingrese Z' required error={errores.z} />
          <CampoTexto label='Desviación Estándar de la Demanda' name='desviacionEstandar' type='number' value={form.desviacionEstandar} onChange={handleChange} placeholder='Ingrese desviación' required error={errores.desviacionEstandar} />
        </div>
      </FormularioSeccion>

      {modo === 'edicion' && datosIniciales?.proveedorPredeterminado !== null && (
        <FormularioSeccion icono={<MdPerson />} titulo='Proveedor Predeterminado'>
          <div className='formulario-grid-single'>
              <label htmlFor='proveedorPredeterminado'>Proveedor</label>
              <select 
                id='proveedorPredeterminado' 
                name='proveedorPredeterminado' 
                value={form.proveedorPredeterminado || ""} 
                onChange={handleChange} 
                className='select-proveedor'
                disabled={cargandoProveedores || actualizandoProveedor}
              >
                <option value=''>
                  {cargandoProveedores ? 'Cargando proveedores...' : 
                   actualizandoProveedor ? 'Actualizando...' : 'Seleccionar proveedor'}
                </option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id.toString()}>
                    {proveedor.nombre} (ID: {proveedor.id})
                  </option>
                ))}
              </select>
              {cargandoProveedores && (
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6c757d', 
                  marginTop: '0.25rem' 
                }}>
                  Cargando proveedores disponibles...
                </div>
              )}
              {actualizandoProveedor && (
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#007bff', 
                  marginTop: '0.25rem' 
                }}>
                  Actualizando proveedor predeterminado...
                </div>
              )}
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#6c757d', 
                marginTop: '0.25rem' 
              }}>
                Proveedores cargados: {proveedores.length} | Valor seleccionado: "{form.proveedorPredeterminado || 'Ninguno'}" | 
                Proveedor existe: {proveedores.some(p => p.id.toString() === form.proveedorPredeterminado) ? 'Sí' : 'No'}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#dc3545', 
                marginTop: '0.25rem',
                backgroundColor: '#f8d7da',
                padding: '0.25rem',
                borderRadius: '4px'
              }}>
                Debug: IDs disponibles: [{proveedores.map(p => p.id).join(', ')}] | 
                Buscando: "{form.proveedorPredeterminado}"
              </div>
          </div>
        </FormularioSeccion>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <BotonAgregar texto={modo === 'alta' ? 'Guardar Artículo' : 'Guardar Cambios'} onClick={handleGuardar} icono={<FaSave />} />
      </div>
    </div>
  );
};

export default FormularioArticulo;
