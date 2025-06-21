import { useEffect, useState } from "react";
import CampoTexto from "../components/CampoText";
import CampoTextoArea from "../components/CampoTextoArea";
import FormularioSeccion from "../components/FormularioSeccion";
import BotonAgregar from "../components/BotonAgregar";
import Notificacion from "../components/Notificacion";
import { MdArticle, MdPerson } from "react-icons/md";
import "../styles/ProveedorPredeterminado.css";
import { apiGet, API_ENDPOINTS, handleApiError } from "../config/api";

interface Articulo {
  codigo: string;
  nombre: string;
  descripcion?: string;
  costoAlmacenamiento: string;
  demanda: string;
  costoCompra: string;
  proveedorPredeterminado?: string;
}

interface Props {
  modo: "alta" | "edicion";
  codigoArticulo?: string; // solo necesario en modo edición
  proveedoresDisponibles?: string[];
  onGuardar: (articulo: Articulo) => void;
}

const FormularioArticulo = ({ modo, codigoArticulo, onGuardar }: Props) => {
  const [form, setForm] = useState<Articulo>({
    codigo: "",
    nombre: "",
    descripcion: "",
    costoAlmacenamiento: "",
    demanda: "",
    costoCompra: "",
    proveedorPredeterminado: "",
  });
  const proveedores = [
    "P001 - Proveedor1",
    "P002 - Proveedor2",
    "P003 - Proveedor3",
  ];
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (modo === "edicion" && codigoArticulo) {
  //     const obtenerArticulo = async () => {
  //       try {
  //         const res = await apiGet(API_ENDPOINTS.ARTICULO_BY_ID(codigoArticulo));
  //         if (!res.ok) {
  //           await handleApiError(res);
  //         }
  //         const data = await res.json();
  //         setForm(data);
  //       } catch (err) {
  //         console.error("Error al obtener artículo:", err);
  //         setMensajeError("No se pudo cargar la información del artículo.");
  //       }
  //     };

  //     obtenerArticulo();
  //   }
  // }, [modo, codigoArticulo]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    const camposRequeridos: { [key: string]: string } = {
      codigo: "Código",
      nombre: "Nombre",
      costoAlmacenamiento: "Costo de almacenamiento",
      demanda: "Demanda",
      costoCompra: "Costo de compra",
    };

    const nuevosErrores: { [key: string]: boolean } = {};
    const camposFaltantes: string[] = [];

    Object.entries(camposRequeridos).forEach(([campo, label]) => {
      if (!form[campo as keyof Articulo]) {
        nuevosErrores[campo] = true;
        camposFaltantes.push(label);
      }
    });

    if (camposFaltantes.length > 0) {
      setMensajeError("Faltan completar los siguientes campos:");
      return;
    }

    setErrores({});
    setMensajeError(null);

    onGuardar(form);
  };

  return (
    <>
      {mensajeError && (
        <div style={{ marginBottom: 16 }}>
          <Notificacion tipo='error' mensaje={mensajeError} />
        </div>
      )}

      <FormularioSeccion
        icono={<MdArticle />}
        titulo='Información básica del artículo'
      >
        <div className='formulario-grid'>
          <CampoTexto
            label='Código'
            name='codigo'
            value={form.codigo}
            onChange={handleChange}
            placeholder='Ingrese código'
            required
            error={errores.codigo}
          />
          <CampoTexto
            label='Nombre'
            name='nombre'
            value={form.nombre}
            onChange={handleChange}
            placeholder='Ingrese nombre'
            required
            error={errores.nombre}
          />
          <CampoTextoArea
            label='Descripción'
            name='descripcion'
            value={form.descripcion || ""}
            onChange={handleChange}
            placeholder='Descripción del artículo'
          />
          <CampoTexto
            label='Costo de almacenamiento'
            name='costoAlmacenamiento'
            type='number'
            value={form.costoAlmacenamiento}
            onChange={handleChange}
            placeholder='Ingrese costo'
            required
            error={errores.costoAlmacenamiento}
          />
          <CampoTexto
            label='Demanda'
            name='demanda'
            type='number'
            value={form.demanda}
            onChange={handleChange}
            placeholder='Ingrese demanda'
            required
            error={errores.demanda}
          />
          <CampoTexto
            label='Costo de compra'
            name='costoCompra'
            type='number'
            value={form.costoCompra}
            onChange={handleChange}
            placeholder='Ingrese costo'
            required
            error={errores.costoCompra}
          />
        </div>
      </FormularioSeccion>

      <FormularioSeccion icono={<MdPerson />} titulo='Proveedor'>
        <div className='formulario-grid'>
          <div className='campo'>
            <label htmlFor='proveedorPredeterminado'>
              Seleccionar proveedor predeterminado:
            </label>
            <select
              id='proveedorPredeterminado'
              name='proveedorPredeterminado'
              value={form.proveedorPredeterminado || ""}
              onChange={handleChange}
              className='select-proveedor'
            >
              <option value=''>Seleccionar proveedor</option>
              {proveedores.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {form.proveedorPredeterminado && (
          <div className='contenedor-proveedor'>
            <span className='etiqueta-predeterminada'>
              Proveedor predeterminado
            </span>
            <span className='nombre-proveedor'>
              {form.proveedorPredeterminado}
            </span>
          </div>
        )}
      </FormularioSeccion>

      <div style={{ marginTop: 24 }}>
        <BotonAgregar
          texto={modo === "alta" ? "Guardar artículo" : "Editar artículo"}
          onClick={handleGuardar}
        />
      </div>
    </>
  );
};

export default FormularioArticulo;
