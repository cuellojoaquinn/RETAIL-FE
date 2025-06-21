// 📁 src/services/articulo.service.example.ts
// Ejemplo de uso del servicio de artículos

import articuloService from './articulo.service';
import type { Articulo } from './articulo.service';

// Ejemplo de uso del servicio de artículos
export const ejemploUsoArticuloService = async () => {
  try {
    console.log('=== Ejemplo de uso del servicio de artículos ===\n');

    // 1. Obtener todos los artículos con paginación
    console.log('1. Obtener artículos (página 0, tamaño 5):');
    const pagina1 = await articuloService.findAll(0, 5);
    console.log(`Total: ${pagina1.totalElements}, Páginas: ${pagina1.totalPages}`);
    console.log('Artículos:', pagina1.content.map(a => `${a.codigo} - ${a.nombre}`));
    console.log('');

    // 2. Obtener artículo por ID
    console.log('2. Obtener artículo por ID (1):');
    const articulo = await articuloService.findById(1);
    console.log('Artículo encontrado:', articulo?.nombre);
    console.log('');

    // 3. Crear nuevo artículo
    console.log('3. Crear nuevo artículo:');
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
    console.log('Artículo creado:', nuevoArticulo.nombre, 'ID:', nuevoArticulo.id);
    console.log('');

    // 4. Actualizar artículo
    console.log('4. Actualizar artículo:');
    const articuloActualizado = await articuloService.updateArticulo(nuevoArticulo.id, {
      precio: '$6000',
      inventario: 15
    });
    console.log('Artículo actualizado:', articuloActualizado.nombre, 'Precio:', articuloActualizado.precio);
    console.log('');

    // 5. Establecer proveedor predeterminado
    console.log('5. Establecer proveedor predeterminado:');
    const articuloConProveedor = await articuloService.setProveedorPredeterminado(nuevoArticulo.id, 1);
    console.log('Proveedor predeterminado establecido:', articuloConProveedor.proveedorPredeterminadoId);
    console.log('');

    // 6. Obtener artículos a reponer
    console.log('6. Artículos que necesitan reposición:');
    const articulosAReponer = await articuloService.getArticulosAReponer();
    console.log('Cantidad:', articulosAReponer.length);
    articulosAReponer.forEach(a => {
      console.log(`- ${a.nombre}: ${a.inventario}/${a.stockSeguridad}`);
    });
    console.log('');

    // 7. Obtener artículos faltantes
    console.log('7. Artículos sin stock:');
    const articulosFaltantes = await articuloService.getArticulosFaltantes();
    console.log('Cantidad:', articulosFaltantes.length);
    articulosFaltantes.forEach(a => {
      console.log(`- ${a.nombre}: ${a.inventario} unidades`);
    });
    console.log('');

    // 8. Buscar artículos
    console.log('8. Buscar artículos por "Mouse":');
    const busqueda = await articuloService.searchArticulos('Mouse');
    console.log('Resultados:', busqueda.length);
    busqueda.forEach(a => console.log(`- ${a.nombre}`));
    console.log('');

    // 9. Obtener estadísticas
    console.log('9. Estadísticas:');
    const estadisticas = await articuloService.getEstadisticas();
    console.log('Total:', estadisticas.total);
    console.log('Activos:', estadisticas.activos);
    console.log('Inactivos:', estadisticas.inactivos);
    console.log('Sin stock:', estadisticas.sinStock);
    console.log('A reponer:', estadisticas.aReponer);
    console.log('');

    // 10. Eliminar artículo (solo si no tiene inventario)
    console.log('10. Intentar eliminar artículo:');
    try {
      await articuloService.deleteById(nuevoArticulo.id);
      console.log('Artículo eliminado exitosamente');
    } catch (error) {
      console.log('Error al eliminar:', error instanceof Error ? error.message : 'Error desconocido');
    }

  } catch (error) {
    console.error('Error en el ejemplo:', error);
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