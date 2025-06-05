import "../styles/Buscador.css";

interface Props {
  value: string;
  onChange: (nuevoValor: string) => void;
  placeholder?: string;
  icono?: React.ReactNode;
}

const Buscador = ({
  value,
  onChange,
  placeholder = "Buscar articulo...",
  icono = "🔍",
}: Props) => {
  return (
    <div className='buscador-container'>
      <span className='icono-lupa'>{icono}</span>
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='buscador-input'
      />
    </div>
  );
};

export default Buscador;
