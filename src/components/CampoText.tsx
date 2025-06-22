import "../styles/CampoTexto.css";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: boolean | string;
  disabled?: boolean;
}

const CampoTexto = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  error = false,
  disabled = false,
}: Props) => {
  const hasError = !!error;

  return (
    <div className='campo'>
      <label htmlFor={name}>
        {label}
        {required && <span className="required-asterisk"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        disabled={disabled}
        className={`campo-input ${hasError ? "input-error" : ""}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      {hasError && typeof error === 'string' && (
        <p id={`${name}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default CampoTexto;
