import "./../styles/BotonAgregar.css";
import { MdAdd } from "react-icons/md";

interface Props {
  onClick: () => void;
  texto?: string;
  icono?: React.ReactNode;
}

const BotonAgregar = ({
  onClick,
  texto = "Agregar",
  icono = <MdAdd />,
}: Props) => {
  return (
    <button className='boton-agregar' onClick={onClick}>
      {icono}
      {texto}
    </button>
  );
};

export default BotonAgregar;
