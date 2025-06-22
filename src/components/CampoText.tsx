import "../styles/CampoTexto.css";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: boolean;
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
  error,
  disabled = false,
}: Props) => {
  return (
    <div className='campo'>
      <label>
        {label}
        {required && " *"}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        disabled={disabled}
        className={`campo-input ${error ? "input-error" : ""}`}
      />
    </div>
  );
};

export default CampoTexto;
