import { useNavigate, useParams } from "react-router-dom";
import FormularioArticulo from "../../components/FormularioArticulo";

const EditarArticulo = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();

  const handleGuardar = async (articuloActualizado: any) => {
    try {
      const res = await fetch(`http://localhost:3000/articulos/${codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articuloActualizado),
      });

      if (!res.ok) throw new Error("Error al actualizar el artículo");

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
