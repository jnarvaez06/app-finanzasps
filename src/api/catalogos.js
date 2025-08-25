import { API_URL } from '../api/config';
const token = sessionStorage.getItem('token');

export const getAccountsSelect = async () => {
    const res = await fetch(`${API_URL}/accountSelect`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    return res.json();
}

export const getCategoriesSelect = async () => {
    const res = await fetch(`${API_URL}/categorySelect`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    return res.json();
}

export const getSubCategoriesSelect = async () => {
    const res = await fetch(`${API_URL}/subcategorySelect`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    return res.json();
}

export const getTypesMovement = [
    {
      idType: 'I',
      description: "Ingreso"
    },
    {
      idType: 'G',
      description: "Gasto"
    }
];