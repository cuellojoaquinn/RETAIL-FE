import "../styles/TablaArticulos.css";
import { MdEdit, MdDelete } from "react-icons/md";

interface Columna<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface Props<T> {
  datos: T[];
  columnas: Columna<T>[];
  onEditar?: (item: T) => void;
  onEliminar?: (item: T) => void;
}

const TablaGenerica = <T,>({
  datos,
  columnas,
  onEditar,
  onEliminar,
}: Props<T>) => {
  return (
    <table className='tabla-articulos'>
      <thead>
        <tr>
          {columnas.map((col, i) => (
            <th key={i}>{col.header}</th>
          ))}
          {(onEditar || onEliminar) && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {datos.map((item, idx) => (
          <tr key={idx}>
            {columnas.map((col, i) => (
              <td key={i}>{col.render(item)}</td>
            ))}
            {(onEditar || onEliminar) && (
              <td>
                <div className='acciones'>
                  {onEditar && (
                    <button onClick={() => onEditar(item)}>
                      <MdEdit />
                    </button>
                  )}
                  {onEliminar && (
                    <button onClick={() => onEliminar(item)}>
                      <MdDelete />
                    </button>
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaGenerica;
