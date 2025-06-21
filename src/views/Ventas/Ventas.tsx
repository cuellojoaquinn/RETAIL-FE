// 📁 src/views/Ventas/Ventas.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablaGenerica from '../../components/TablaGenerica';
import BotonAgregar from '../../components/BotonAgregar';

interface Venta {
  id: string;
  articulo: string;
  fecha: string;
  cantidad: number;
  monto: number;
}

const ventasMock: Venta[] = [
  {
    id: 'V001',
    articulo: 'Artículo A1',
    fecha: '20/06/2025',
    cantidad: 2,
    monto: 200
  },
  {
    id: 'V002',
    articulo: 'Artículo B1',
    fecha: '21/06/2025',
    cantidad: 1,
    monto: 120
  }
];

const Ventas = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setVentas(ventasMock);
  }, []);

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Ventas</h1>
        <BotonAgregar texto="Realizar venta" onClick={() => navigate('/ventas/alta')} />
      </div>

      {ventas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No se han realizado ventas hasta el momento</p>
        </div>
      ) : (
        <TablaGenerica
          datos={ventas}
          columnas={[
            { header: "ID", render: (v: any) => v.id },
            { header: "Artículo", render: (v: any) => v.articulo },
            { header: "Fecha", render: (v: any) => v.fecha },
            { header: "Cantidad", render: (v: any) => v.cantidad },
            { header: "Monto", render: (v: any) => `$${v.monto}` }
          ]}
        />
      )}
    </div>
  );
};

export default Ventas;