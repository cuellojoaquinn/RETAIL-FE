interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const CampoTextoArea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  error,
}: Props) => (
  <div className='campo full'>
    <label>
      {label}
      {required && " *"}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        border: error ? '1px solid #dc3545' : undefined
      }}
    />
    {error && (
      <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
        {error}
      </div>
    )}
  </div>
);

export default CampoTextoArea;
