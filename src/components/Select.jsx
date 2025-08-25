const Select = ({
    options,
    value,
    onChange,
    labelKey = "label",
    valueKey = "value",
    placeholder = "Seleccione...",
    disabled=false
}) => (
    <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
        disabled={disabled}
    >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
            <option key={opt[valueKey]} value={opt[valueKey]}>
                {opt[labelKey]}
            </option>
        ))}
    </select>
);

export default Select;
  