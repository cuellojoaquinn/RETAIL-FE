import "../styles/Buscador.css";
import React, { useRef } from "react";

interface Props {
  value: string;
  onChange: (nuevoValor: string) => void;
  placeholder?: string;
  icono?: React.ReactNode;
}

const lupaSVG = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke="#888" strokeWidth="2" />
    <line x1="14.5" y1="14.5" x2="19" y2="19" stroke="#888" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Buscador = ({
  value,
  onChange,
  placeholder = "Buscar articulo...",
  icono = lupaSVG,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className='buscador-container' style={{ position: 'relative' }}>
      <span className='icono-lupa'>{icono}</span>
      <input
        ref={inputRef}
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='buscador-input'
      />
      {value && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="5" x2="15" y2="15" stroke="#888" strokeWidth="2" strokeLinecap="round" />
            <line x1="15" y1="5" x2="5" y2="15" stroke="#888" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Buscador;
