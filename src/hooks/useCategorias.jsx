// src/hooks/useCategorias.js
import { useEffect, useState, useCallback } from 'react';
import { API_URL } from '../api/config';

export default function useCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
        setError('401');
        setCategorias([]);
        return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/category`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                throw new Error('401');
            }

            if (!res.ok) {
                throw new Error('Error al obtener categorías');
            }

            const data = await res.json();
            setCategorias(data);
        } catch (err) {
            setError(err.message);
            setCategorias([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { categorias, loading, error, refetch: fetchData };
}
