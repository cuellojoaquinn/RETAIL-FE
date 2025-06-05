interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const CampoTextoArea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
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
    />
  </div>
);

export default CampoTextoArea;
