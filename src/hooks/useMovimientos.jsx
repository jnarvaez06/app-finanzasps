import { useState } from 'react';
import { API_URL } from '../api/config';

export function useMovimientos() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const guardarMovimiento = async (data) => {
		try {
			setLoading(true);

			console.log("recibo", data)
			
			const token = sessionStorage.getItem('token');
			const username = sessionStorage.getItem('username');
			const value = parseMonto(data.monto);

			const postData = {
				idAccount:data.accountId,
				description:data.descripcion,
				type:data.typeMovementId,
				dateMovement:data.fecha,
				value:value,
				idCategory:data.categoryId,
				idSubCategory:data.subCategoryId,
				user:username,
				...(data.isEdit && { idMovement: data.idMovement })
			};

			let url = `${API_URL}/movement`;
			let method = 'POST';
			if (data.isEdit) {
				url = `${API_URL}/movement/${data.idMovement}`;
				method = 'PUT';
			}

			const res = await fetch(url, {
				method: method,
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


function parseMonto(monto) {
	if (typeof monto === "number") {
	  return monto; // ya es numérico
	}
  
	if (typeof monto === "string") {
	  // quitamos puntos de miles y cambiamos coma por punto decimal
	  return parseFloat(monto.replace(/\./g, "").replace(",", "."));
	}
  
	return NaN; // caso inesperado
  }