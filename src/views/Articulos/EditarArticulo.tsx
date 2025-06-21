import { useNavigate, useParams } from "react-router-dom";
import FormularioArticulo from "../../components/FormularioArticulo";
import { apiPut, API_ENDPOINTS, handleApiError } from "../../config/api";

const EditarArticulo = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();

  const handleGuardar = async (articuloActualizado: any) => {
    try {
      const res = await apiPut(API_ENDPOINTS.ARTICULO_BY_ID(codigo!), articuloActualizado);

      if (!res.ok) {
        await handleApiError(res);
      }

      alert("Artículo actualizado correctamente");
      navigate("/articulos");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("No se pudo actualizar el artículo");
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
          &gt; Editar artículo
        </h1>
      </div>

      <FormularioArticulo
        modo='edicion'
        codigoArticulo={codigo}
        onGuardar={handleGuardar}
      />
    </div>
  );
};

export default EditarArticulo;
