const Select = ({
    options,
    labelKey = "label",
    valueKey = "value",
    placeholder = "Seleccione...",
    disabled = false,
    ...props
}) => (
    <select 
        className="form-select"
        disabled={disabled}
        {...props}   // <- aquí recibirá lo de register
    >
    <option value="">{placeholder}</option>
    {Array.isArray(options) &&
    options.map((opt) => (
        <option key={opt[valueKey]} value={opt[valueKey]}>
            {opt[labelKey]}
        </option>
    ))}
    </select>
);

export default Select;