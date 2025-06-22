// 📁 src/services/articulo.service.example.ts
// Ejemplo de uso del servicio de artículos

import articuloService from './articulo.service';
import type { Articulo } from './articulo.service';

// Ejemplo de uso del servicio de artículos
export const ejemploUsoArticuloService = async () => {
  try {
    // 1. Obtener todos los artículos con paginación
    const pagina1 = await articuloService.findAll(0, 5);
    
    // 2. Obtener artículo por ID
    const articulo = await articuloService.findById(1);
    
    // 3. Crear nuevo artículo
    const nuevoArticulo = await articuloService.saveArticulo({
      codigo: 'A021',
      nombre: 'Nuevo Artículo de Prueba',
      estado: 'Activo',
      proveedor: 'Proveedor Test',
      precio: '$5000',
      inventario: 10,
      stockSeguridad: 5,
      tipoModelo: 'Test'
    });
    
    // 4. Actualizar artículo
    const articuloActualizado = await articuloService.updateArticulo(nuevoArticulo.id, {
      precio: '$6000',
      inventario: 15
    });
    
    // 5. Establecer proveedor predeterminado
    const articuloConProveedor = await articuloService.setProveedorPredeterminado(nuevoArticulo.id, 1);
    
    // 6. Obtener artículos a reponer
    const articulosAReponer = await articuloService.getArticulosAReponer();
    
    // 7. Obtener artículos faltantes
    const articulosFaltantes = await articuloService.getArticulosFaltantes();
    
    // 8. Buscar artículos
    const busqueda = await articuloService.searchArticulos('Mouse');
    
    // 9. Eliminar artículo (solo si no tiene inventario)
    try {
      await articuloService.deleteById(nuevoArticulo.id);
    } catch (error) {
      // Error al eliminar
    }

  } catch (error) {
    // Error en el ejemplo
  }
};

// Ejemplo de uso en un componente React
export const ejemploUsoEnComponente = () => {
  // En un componente React, podrías usar así:
  
  /*
  import React, { useState, useEffect } from 'react';
  import articuloService, { Articulo } from '../services/articulo.service';

  const ArticulosComponent = () => {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const cargarArticulos = async () => {
        try {
          setLoading(true);
          const response = await articuloService.findAll(0, 10);
          setArticulos(response.content);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setLoading(false);
        }
      };

      cargarArticulos();
    }, []);

    const handleCrearArticulo = async (nuevoArticulo: Omit<Articulo, 'id'>) => {
      try {
        const creado = await articuloService.saveArticulo(nuevoArticulo);
        setArticulos(prev => [...prev, creado]);
        // Mostrar notificación de éxito
      } catch (err) {
        // Mostrar error
        console.error('Error al crear artículo:', err);
      }
    };

    const handleEliminarArticulo = async (id: number) => {
      try {
        await articuloService.deleteById(id);
        setArticulos(prev => prev.filter(a => a.id !== id));
        // Mostrar notificación de éxito
      } catch (err) {
        // Mostrar error
        console.error('Error al eliminar artículo:', err);
      }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <h1>Artículos</h1>
        {articulos.map(articulo => (
          <div key={articulo.id}>
            <h3>{articulo.nombre}</h3>
            <p>Código: {articulo.codigo}</p>
            <p>Precio: {articulo.precio}</p>
            <p>Inventario: {articulo.inventario}</p>
            <button onClick={() => handleEliminarArticulo(articulo.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    );
  };
  */
}; 