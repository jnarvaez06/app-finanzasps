// hooks/useMovimientos.js
import { useState } from 'react';
import { API_URL } from '../api/config';

export function useMovimientos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const guardarMovimiento = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/movement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al guardar el movimiento');
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { guardarMovimiento, loading, error };
}
