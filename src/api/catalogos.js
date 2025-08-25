import { API_URL } from '../api/config';
const token = sessionStorage.getItem('token');

export const getAccountsSelect = async () => {
    const res = await fetch(`${API_URL}/accountSelect`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    console.log(res)
    return res.json();
}