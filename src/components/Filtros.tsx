import "../styles/Filtros.css";

interface Opcion<T extends string> {
  valor: T;
  etiqueta: string;
}

interface Props<T extends string> {
  valorSeleccionado: T;
  onCambiar: (nuevoValor: T) => void;
  opciones: Opcion<T>[];
}

const Filtros = <T extends string>({
  valorSeleccionado,
  onCambiar,
  opciones,
}: Props<T>) => {
  return (
    <select
      className='filtros'
      value={valorSeleccionado}
      onChange={(e) => onCambiar(e.target.value as T)}
    >
      {opciones.map(({ valor, etiqueta }) => (
        <option key={valor} value={valor}>
          {etiqueta}
        </option>
      ))}
    </select>
  );
};

export default Filtros;
