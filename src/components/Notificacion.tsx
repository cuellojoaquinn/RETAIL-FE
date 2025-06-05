import "../styles/Notifcacion.css";

interface Props {
  tipo?: "error" | "exito" | "info";
  mensaje: string;
}

const Notificacion = ({ tipo = "info", mensaje }: Props) => {
  return <div className={`notificacion notificacion-${tipo}`}>{mensaje}</div>;
};

export default Notificacion;
