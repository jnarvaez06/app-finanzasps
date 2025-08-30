export default function NumberInput(props) {
    const formatNumber = (val) => {
      if (!val) return "";
      return new Intl.NumberFormat("es-CO").format(val);
    };
  
    const handleInput = (e) => {
      // mantén solo números
      const rawValue = e.target.value.replace(/\D/g, "");
      // asigna al input formateado
      e.target.value = formatNumber(rawValue);
    };
  
    return (
      <input
        type="text"
        onInput={handleInput}
        {...props}
      />
    );
  }
  