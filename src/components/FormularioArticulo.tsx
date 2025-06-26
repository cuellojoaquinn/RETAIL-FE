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

      
      const proveedorPredeterminadoValue = datosIniciales.proveedorPredeterminado?.toString() || "";
      
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
      cargarProveedores();
    } else if (modo === 'edicion') {
    }
  }, [modo, datosIniciales?.proveedorPredeterminado]);


  // Efecto para asegurar que el proveedor predeterminado se seleccione cuando se cargan los proveedores
  useEffect(() => {
    if (modo === 'edicion' && !cargandoProveedores && proveedores.length > 0 && datosIniciales?.proveedorPredeterminado !== null) {
      
      const proveedorPredeterminadoValue = datosIniciales?.proveedorPredeterminado?.toString() || "";
      const proveedorExiste = proveedores.some(p => p.id.toString() === proveedorPredeterminadoValue);
      
      
      if (proveedorExiste && form.proveedorPredeterminado !== proveedorPredeterminadoValue) {
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
      if (!datosIniciales?.id) {
        throw new Error('ID del artículo no disponible para cargar proveedores.');
      }
      const articuloId = parseInt(datosIniciales.id, 10);
      const proveedoresData = await proveedorService.findProveedoresByArticuloId(articuloId);
      setProveedores(proveedoresData);
    } catch (error) {
      console.error('Error cargando proveedores:', error);
      setMensajeGlobalError('Error cargando la lista de proveedores.');
    } finally {
      setCargandoProveedores(false);
    }
  };

  const actualizarProveedorPredeterminado = async (proveedorId: number) => {
    try {
      setActualizandoProveedor(true);
      
      if (!datosIniciales?.id) {
        throw new Error('ID del artículo no disponible');
      }
      
      const articuloId = parseInt(datosIniciales.id);
      const resultado = await articuloServiceReal.setProveedorPredeterminado(articuloId, proveedorId);
      
      setMensajeGlobalError(null);
    } catch (error) {
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

    // --- Validación de campos de texto ---
    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido.";
    }

    // --- Validación de campos numéricos ---
    const camposAValidar: { nombre: keyof ArticuloForm, noNegativo: boolean, etiqueta: string }[] = [
      { nombre: 'costoAlmacenamiento', noNegativo: true, etiqueta: 'Costo de Almacenamiento' },
      { nombre: 'demandaArticulo', noNegativo: true, etiqueta: 'Demanda' },
      { nombre: 'costoVenta', noNegativo: true, etiqueta: 'Costo de Venta' },
      { nombre: 'stockActual', noNegativo: true, etiqueta: 'Stock Actual' },
      { nombre: 'produccionDiaria', noNegativo: true, etiqueta: 'Producción Diaria' },
      { nombre: 'z', noNegativo: false, etiqueta: 'Nivel de Confianza (Z)' },
      { nombre: 'desviacionEstandar', noNegativo: true, etiqueta: 'Desviación Estándar' },
    ];

    camposAValidar.forEach(({ nombre, noNegativo, etiqueta }) => {
      const valor = form[nombre];

      if (valor === null || valor === undefined || valor.toString().trim() === '') {
        nuevosErrores[nombre] = `El campo "${etiqueta}" es requerido.`;
        return; 
      }

      const valorNumerico = parseFloat(valor);

      if (isNaN(valorNumerico)) {
        nuevosErrores[nombre] = `El campo "${etiqueta}" debe ser un número.`;
        return;
      }

      if (noNegativo && valorNumerico < 0) {
        nuevosErrores[nombre] = `El campo "${etiqueta}" no puede ser negativo.`;
      }
    });

    if (modo === 'alta' && !form.codigo.trim()) {
      nuevosErrores.codigo = "El código es requerido.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = () => {
    setMensajeGlobalError(null);
    if (!validarFormulario()) {
      setMensajeGlobalError("Por favor, corrija los errores en el formulario.");
      return;
    }
    
    // Si es modo edición, excluir el campo proveedorPredeterminado del JSON
    if (modo === 'edicion') {
      const { proveedorPredeterminado, ...datosParaEnviar } = form;
      onGuardar(datosParaEnviar);
    } else {
      onGuardar(form);
    }
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
          <CampoTexto label='Demanda' name='demandaArticulo' type='number' value={form.demandaArticulo} onChange={handleChange} placeholder='Ingrese demanda' required error={errores.demandaArticulo} />
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
            <div style={{ marginBottom: '1rem' }}>
              {(() => {
                if (!form.proveedorPredeterminado) return null;

                const proveedorActual = proveedores.find(p => p.id.toString() === form.proveedorPredeterminado);
                const nombreProveedor = proveedorActual?.nombreProveedor || `(ID: ${form.proveedorPredeterminado})`;
                
                //console.log(datosIniciales.proveedorPredeterminado.nombre);
                return (
                  <div style={{
                    backgroundColor: '#e8f0fe',
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    display: 'inline-block',
                    marginTop: '0.5rem',
                  }}>
                    <strong style={{
                      backgroundColor: '#2ee0c3',
                      color: 'white',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      marginRight: '0.5rem'
                    }}>
                      Proveedor predeterminado
                    </strong>
                    {datosIniciales.proveedorPredeterminado.nombre}
                  </div>
                );
              })()}
            </div>
            
            <div>
              <label htmlFor='proveedorPredeterminado'>Cambiar proveedor predeterminado:  </label>
              <select 
                id='proveedorPredeterminado' 
                name='proveedorPredeterminado' 
                value={form.proveedorPredeterminado || ""} 
                onChange={handleChange} 
                className='select-proveedor'
                disabled={cargandoProveedores || actualizandoProveedor}
                style={{ marginTop: '0.5rem' }}
              >
                <option value=''>
                  {cargandoProveedores ? 'Cargando proveedores...' : 
                   actualizandoProveedor ? 'Actualizando...' : 'Seleccionar proveedor'}
                </option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id.toString()}>
                    {proveedor.nombreProveedor}
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
