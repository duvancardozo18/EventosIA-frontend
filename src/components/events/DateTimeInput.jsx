import Label from "./LabelForm";
import InputForm from "./InputForm";

const DateTimeInput = ({
  id,
  label, // <-- Cambiado a minúscula para el texto
  value,
  onChange,
  error,
  className = ""
}) => {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label> {/* Usamos el componente Label */}
      <InputForm
        type="datetime-local"
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full ${error ? 'border-red-500' : ''}`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default DateTimeInput;