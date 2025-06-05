import "../styles/FiltrosRapidos.css";

interface Props {
  activo: string;
  onSeleccionar: (valor: string) => void;
}

const opciones = ["Todos", "A reponer", "Faltantes", "Por proveedor"];

const FiltrosRapidos = ({ activo, onSeleccionar }: Props) => {
  return (
    <div className='filtros-rapidos'>
      {opciones.map((op) => (
        <button
          key={op}
          className={`filtro-rapido ${activo === op ? "activo" : ""}`}
          onClick={() => onSeleccionar(op)}
        >
          {op}
        </button>
      ))}
    </div>
  );
};

export default FiltrosRapidos;
