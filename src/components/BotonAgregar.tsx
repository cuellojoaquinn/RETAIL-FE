import "./../styles/BotonAgregar.css";
import { MdAdd } from "react-icons/md";

interface Props {
  onClick: () => void;
  texto?: string;
  icono?: React.ReactNode;
  disabled?: boolean;
}

const BotonAgregar = ({
  onClick,
  texto = "Agregar",
  icono = <MdAdd />,
  disabled = false,
}: Props) => {
  return (
    <button 
      className='boton-agregar' 
      onClick={onClick}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
    >
      {icono}
      {texto}
    </button>
  );
};

export default BotonAgregar;
