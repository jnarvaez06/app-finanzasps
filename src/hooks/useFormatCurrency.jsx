import { useCallback } from "react";

export function useFormatCurrency({ locale = "es-CO", currency = "COP", decimals = 2 } = {}) {
  const formatCurrency = useCallback(
    (value) => {
      if (isNaN(value)) return "0";

      const factor = Math.pow(10, decimals);
      const truncated = Math.floor(value * factor) / factor;

      return truncated.toLocaleString(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    },
    [locale, currency, decimals]
  );

  return { formatCurrency };
}
