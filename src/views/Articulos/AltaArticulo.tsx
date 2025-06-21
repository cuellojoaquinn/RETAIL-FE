import { useState } from "react";
import { MdArticle } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import CampoTexto from "../../components/CampoText";
import CampoTextoArea from "../../components/CampoTextoArea";
import FormularioSeccion from "../../components/FormularioSeccion";
import "../../styles/AltaArticulo.css";
import { useNavigate } from "react-router-dom";
import BotonAgregar from "../../components/BotonAgregar";
import Notificacion from "../../components/Notificacion";

const AltaArticulo = () => {
  const navigate = useNavigate();
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});

  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    costoAlmacenamiento: "",
    demanda: "",
    costoCompra: "",
  });
  const [mensajeError, setMensajeError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    const camposObligatorios: { [key: string]: string } = {
      codigo: "Código",
      nombre: "Nombre",
      costoAlmacenamiento: "Costo de almacenamiento",
      demanda: "Demanda artículo",
      costoCompra: "Costo de compra",
    };

    const nuevosErrores: { [key: string]: boolean } = {};
    const camposFaltantes: string[] = [];

    Object.entries(camposObligatorios).forEach(([campo, label]) => {
      if (!form[campo as keyof typeof form]) {
        nuevosErrores[campo] = true;
        camposFaltantes.push(label);
      }
    });

    if (camposFaltantes.length > 0) {
      setErrores(nuevosErrores);
      setMensajeError(`Faltan completar: ${camposFaltantes.join(", ")}`);
      return;
    }

    setErrores({});
    setMensajeError("");

    const nuevoArticulo = {
      ...form,
      costoAlmacenamiento: parseFloat(form.costoAlmacenamiento),
      demanda: parseFloat(form.demanda),
      costoCompra: parseFloat(form.costoCompra),
    };

    try {
      await new Promise((res) => setTimeout(res, 1000));
      navigate("/articulos");
    } catch (error) {
      console.error("Error:", error);
      setMensajeError("Hubo un problema al guardar el artículo.");
    }
  };

  return (
    <div className='alta-articulo-container'>
      <div className='header'>
        <h1>
          <span
            className='breadcrumb-link'
            onClick={() => navigate("/articulos")}
          >
            Artículos
          </span>{" "}
          &gt; Agregar artículo
        </h1>
      </div>
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
            value={form.descripcion}
            onChange={handleChange}
            placeholder='Descripción artículo'
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
            label='Demanda artículo'
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
        <BotonAgregar
          texto='Guardar artículo'
          onClick={handleGuardar}
          icono={<FaSave />}
        />
      </FormularioSeccion>
      <div style={{ marginTop: 16 }}>
        {mensajeError && <Notificacion tipo='error' mensaje={mensajeError} />}
      </div>
    </div>
  );
};

export default AltaArticulo;
