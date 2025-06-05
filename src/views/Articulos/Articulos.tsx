import { useState } from "react";
import Buscador from "../../components/Buscador";
import BotonAgregar from "../../components/BotonAgregar";

import "../../styles/Articulos.css";
import TablaGenerica from "../../components/TablaGenerica";
import { useNavigate } from "react-router-dom";
import FiltrosRapidos from "../../components/FiltrosRapidos";

interface Articulo {
  codigo: string;
  nombre: string;
  estado: "Activo" | "Inactivo";
  proveedor: string;
  precio: string;
  inventario: number;
  stockSeguridad: number;
  tipoModelo: string;
}

const Articulos = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([
    {
      codigo: "A001",
      nombre: "Mouse Logitech",
      estado: "Activo",
      proveedor: "Proveedor A",
      precio: "$1500",
      inventario: 50,
      stockSeguridad: 10,
      tipoModelo: "Accesorio",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
    {
      codigo: "A002",
      nombre: "Teclado Mecánico",
      estado: "Inactivo",
      proveedor: "Proveedor B",
      precio: "$3000",
      inventario: 20,
      stockSeguridad: 5,
      tipoModelo: "Periférico",
    },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRapido, setFiltroRapido] = useState("Todos");

  const [estadoFiltro, setEstadoFiltro] = useState<
    "Todos" | "Activo" | "Inactivo"
  >("Todos");
  const navigate = useNavigate();

  const handleAgregar = () => {
    navigate("/articulos/nuevo");
  };
  const handleEditar = (codigo: string) => {
    alert(`Editar artículo ${codigo}`);
  };

  const handleEliminar = (codigo: string) => {
    setArticulos((prev) => prev.filter((a) => a.codigo !== codigo));
  };

  const articulosFiltrados = articulos.filter((art) => {
    const coincideBusqueda =
      art.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      art.codigo.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      estadoFiltro === "Todos" || art.estado === estadoFiltro;

    const coincideFiltroRapido =
      filtroRapido === "Todos"
        ? true
        : filtroRapido === "A reponer"
        ? art.inventario <= art.stockSeguridad
        : filtroRapido === "Faltantes"
        ? art.inventario === 0
        : true;

    return coincideBusqueda && coincideEstado && coincideFiltroRapido;
  });

  return (
    <div className='articulos-container'>
      <h1>Articulos</h1>
      <div className='articulos-header'>
        <Buscador value={busqueda} onChange={setBusqueda} />
        <div className='articulos-header'>
          <FiltrosRapidos
            activo={filtroRapido}
            onSeleccionar={setFiltroRapido}
          />
        </div>
        <BotonAgregar onClick={handleAgregar} texto='Agregar artículo' />
      </div>
      <TablaGenerica
        datos={articulosFiltrados}
        columnas={[
          { header: "Código", render: (a) => <strong>{a.codigo}</strong> },
          { header: "Nombre", render: (a) => <strong>{a.nombre}</strong> },
          {
            header: "Estado",
            render: (a) => (
              <span className={`estado ${a.estado.toLowerCase()}`}>
                {a.estado}
              </span>
            ),
          },
          { header: "Proveedor", render: (a) => a.proveedor },
          { header: "Precio", render: (a) => a.precio },
          { header: "Inventario", render: (a) => a.inventario },
          { header: "Stock de seguridad", render: (a) => a.stockSeguridad },
          { header: "Tipo de Modelo", render: (a) => a.tipoModelo },
        ]}
        onEditar={(a) => handleEditar(a.codigo)}
        onEliminar={(a) => handleEliminar(a.codigo)}
      />
    </div>
  );
};

export default Articulos;
