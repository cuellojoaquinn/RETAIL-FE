import { useNavigate, useParams } from "react-router-dom";
import FormularioArticulo from "../../components/FormularioArticulo";
import articuloServiceReal from "../../services/articulo.service.real";
import type { EditarArticuloDTO } from "../../services/articulo.service.real";
import { useEffect, useState } from "react";

// Interfaz que coincide con la respuesta del endpoint real
interface ArticuloBackend {
  id: number;
  codArticulo: number;
  nombre: string;
  descripcion: string;
  produccionDiaria: number;
  demandaArticulo: number;
  costoAlmacenamiento: number;
  costoVenta: number;
  fechaBajaArticulo: string | null;
  puntoPedido: number;
  stockSeguridad: number;
  inventarioMaximo: number;
  loteOptimo: number;
  stockActual: number;
  z: number;
  desviacionEstandar: number;
  proveedorPredeterminado: number | null;
  cgi: number;
}

const EditarArticulo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [articulo, setArticulo] = useState<ArticuloBackend | null>(null);


  // Cargar artículo cuando el componente se monta o cambia el ID
  useEffect(() => {
    if (id) {
      cargarArticulo(id);
    }
  }, [id]);

  const cargarArticulo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await articuloServiceReal.findById(parseInt(id));
      if (response) {
        setArticulo(response);
      } else {
        setError("Artículo no encontrado");
      }
      
    } catch (err) {
      console.error('Error cargando artículo:', err);
      setError(err instanceof Error ? err.message : 'Error cargando artículo');
    } finally {
      setLoading(false);
    }
  };
    
  const handleGuardar = async (articuloActualizado: any) => {
    try {
      // Convertir el formato del formulario al formato esperado por el backend
      const articuloParaEnviar: EditarArticuloDTO = {
        nombre: articuloActualizado.nombre,
        descripcion: articuloActualizado.descripcion,
        demanda: parseFloat(articuloActualizado.demandaArticulo),
        costoAlmacenamiento: parseFloat(articuloActualizado.costoAlmacenamiento),
        costoVenta: parseFloat(articuloActualizado.costoVenta),
        stockActual: parseInt(articuloActualizado.stockActual),
        produccionDiaria: parseInt(articuloActualizado.produccionDiaria),
        z: parseInt(articuloActualizado.z),
        desviacionEstandar: parseInt(articuloActualizado.desviacionEstandar),
      };
      
      console.log("articuloParaEnviar", articuloParaEnviar);
      await articuloServiceReal.updateArticulo(parseInt(id!), articuloParaEnviar);

      alert("Artículo actualizado correctamente");
      navigate("/articulos");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("No se pudo actualizar el artículo");
    }
  };

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
        <p>Cargando artículo...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        color: '#dc3545'
      }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => navigate("/articulos")}
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
          Volver a Artículos
        </button>
      </div>
    );
  }

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

      {articulo && (
        <FormularioArticulo
          datosIniciales={articulo}
          modo='edicion'
          onGuardar={handleGuardar}
        />
      )}
    </div>
  );
};

export default EditarArticulo;

