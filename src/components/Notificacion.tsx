import { useEffect, useState } from "react";
import "../styles/Notifcacion.css";

interface Props {
  tipo?: "error" | "exito" | "info";
  mensaje: string;
  duracion?: number; // duración en milisegundos (opcional)
}

const Notificacion = ({ tipo = "info", mensaje, duracion = 7000 }: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duracion);

    return () => clearTimeout(timer);
  }, [duracion]);

  if (!visible) return null;

  return <div className={`notificacion notificacion-${tipo}`}>{mensaje}</div>;
};

export default Notificacion;
