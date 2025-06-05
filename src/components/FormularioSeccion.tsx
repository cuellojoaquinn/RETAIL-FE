interface Props {
  icono: React.ReactNode;
  titulo: string;
  children: React.ReactNode;
}

const FormularioSeccion = ({ icono, titulo, children }: Props) => {
  return (
    <div className='formulario-card'>
      <div className='formulario-header'>
        {icono}
        <h3>{titulo}</h3>
      </div>
      {children}
    </div>
  );
};

export default FormularioSeccion;
