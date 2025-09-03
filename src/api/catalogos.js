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

export const getMonths = () => {
    // Detectar el idioma del navegador
    const idiomaBrowser = navigator.language || navigator.languages[0] || 'es-ES';
    
    const meses = [];
    for (let i = 0; i < 12; i++) {
        const fecha = new Date(2024, i, 1);
        const nombreMes = fecha.toLocaleDateString(idiomaBrowser, { month: 'long' });
        meses.push({
            idMonth: i + 1,
            description: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)
        });
    }
    return meses;
}

export const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        years.push({
            idYear: i,
            description: i.toString()
        })        
    }

    return years;
}