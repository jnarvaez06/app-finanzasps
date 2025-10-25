import { forwardRef } from "react";

const Select = forwardRef(({
    options,
    labelKey = "label",
    valueKey = "value",
    placeholder = "Seleccione...",
    disabled = false,
    error,
    ...props
}, ref) => (
    <div>
        <select 
            ref={ref}
            className={`form-select ${error ? 'is-invalid' : ''}`}
            disabled={disabled}
            {...props}
        >
            <option value="">{placeholder}</option>
            {Array.isArray(options) &&
                options.map((opt) => (
                    <option key={opt[valueKey]} value={opt[valueKey]}>
                        {opt[labelKey]}
                    </option>
                ))
            }
        </select>
        {error && <div className="invalid-feedback">{error}</div>}
    </div>
));

Select.displayName = "Select";

export default Select;