import { useNavigate, useParams } from "react-router-dom";
import FormularioArticulo from "../../components/FormularioArticulo";
import { apiPut, API_ENDPOINTS, handleApiError } from "../../config/api";
import articuloService from "../../services/articulo.service";
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

      
      const response = await articuloService.findById(parseInt(id));
      if (response) {
        // Convertir la respuesta del servicio mock al formato del backend real
        const articuloBackend: ArticuloBackend = {
          id: response.id,
          codArticulo: parseInt(response.codigo),
          nombre: response.nombre,
          descripcion: response.tipoModelo || "",
          produccionDiaria: 0,
          demandaArticulo: response.inventario,
          costoAlmacenamiento: parseFloat(response.precio.replace('$', '')),
          costoVenta: parseFloat(response.precio.replace('$', '')),
          fechaBajaArticulo: response.estado === 'Inactivo' ? new Date().toISOString() : null,
          puntoPedido: 0,
          stockSeguridad: response.stockSeguridad,
          inventarioMaximo: response.inventario,
          loteOptimo: 0,
          stockActual: response.inventario,
          z: 0,
          desviacionEstandar: 0,
          proveedorPredeterminado: response.proveedorPredeterminadoId || null,
          cgi: 0,
        };
        setArticulo(articuloBackend);
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
      const articuloParaEnviar = {
        codArticulo: parseInt(articuloActualizado.codigo),
        nombre: articuloActualizado.nombre,
        descripcion: articuloActualizado.descripcion,
        costoAlmacenamiento: parseFloat(articuloActualizado.costoAlmacenamiento),
        demandaArticulo: parseFloat(articuloActualizado.demanda),
        costoVenta: parseFloat(articuloActualizado.costoCompra),
      };
      console.log("articuloParaEnviar", articuloParaEnviar);
      const res = await apiPut(API_ENDPOINTS.ARTICULO_BY_ID(id!), articuloParaEnviar);

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

      {articulo && id && (
        <FormularioArticulo
          modo='edicion'
          codigoArticulo={id}
          onGuardar={handleGuardar}
        />
      )}
    </div>
  );
};

export default EditarArticulo;

