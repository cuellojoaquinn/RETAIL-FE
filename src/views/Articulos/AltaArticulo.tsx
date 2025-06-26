import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormularioArticulo from "../../components/FormularioArticulo";
import articuloServiceReal, { type CrearArticuloDTO } from "../../services/articulo.service.real";
import Notificacion from "../../components/Notificacion";
import "../../styles/AltaArticulo.css";

const AltaArticulo = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleGuardar = async (articulo: any) => {
    setError(null);
    try {
      const articuloDTO: CrearArticuloDTO = {
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        costoAlmacenamiento: parseFloat(articulo.costoAlmacenamiento),
        demandaArticulo: parseFloat(articulo.demandaArticulo),
        costoVenta: parseFloat(articulo.costoVenta),
        stockActual: parseInt(articulo.stockActual),
        produccionDiaria: parseInt(articulo.produccionDiaria),
        z: parseFloat(articulo.z),
        desviacionEstandar: parseInt(articulo.desviacionEstandar),
      };

      if (articulo.codigo) {
        articuloDTO.codArticulo = parseInt(articulo.codigo);
      }

      await articuloServiceReal.saveArticulo(articuloDTO);
      alert("Artículo creado correctamente");
      navigate("/articulos");
    } catch (err) {
      console.error("Error al guardar:", err);
      const errorMessage = err instanceof Error ? err.message : "Hubo un problema al guardar el artículo.";
      setError(errorMessage);
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

      {error && <div style={{ marginBottom: 16 }}><Notificacion tipo='error' mensaje={error} /></div>}
      
      <FormularioArticulo
        modo='alta'
        onGuardar={handleGuardar}
      />
    </div>
  );
};

export default AltaArticulo;
