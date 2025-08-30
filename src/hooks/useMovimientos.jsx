import { useState } from 'react';
import { API_URL } from '../api/config';

export function useMovimientos() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const guardarMovimiento = async (data) => {
		try {
			setLoading(true);
			
			const token = sessionStorage.getItem('token');
			const username = sessionStorage.getItem('username');
			const value = parseFloat(data.monto.replace(/\./g, "").replace(",", "."));

			const postData = {
				idAccount:data.accountId,
				description:data.descripcion,
				type:data.typeMovementId,
				dateMovement:data.fecha,
				value:value,
				idCategory:data.categoryId,
				idSubCategory:data.subCategoryId,
				user:username
			};

			const res = await fetch(`${API_URL}/movement`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(postData),
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
