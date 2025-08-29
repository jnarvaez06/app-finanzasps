// components/NumberInput.jsx
import { useState } from "react";

export default function NumberInput({ value, onChange, ...props }) {
  const formatNumber = (val) => {
    if (!val) return "";
    return new Intl.NumberFormat("es-CO").format(val);
  };

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    onChange(rawValue);
  };

  return (
    <input
      type="text"
      value={formatNumber(value)}
      onChange={handleChange}
      {...props}
    />
  );
}
