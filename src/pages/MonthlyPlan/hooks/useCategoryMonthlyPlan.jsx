import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../../api/config";

export function useCategoryMonthlyPlan() {
    const token = sessionStorage.getItem('token');

    return useQuery({
        queryKey: ['categoryMonthlyPlan'],
        queryFn: async () => {
            console.log("despues de")
            const res = await fetch(`${API_URL}/categoryMonthlyPlan?`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            if (!res.ok) {
                throw new Error('Error al cargar las categorías del plan mensual');
            }

            const data = await res.json();
            
            return data;
        },
        enabled: !!token, // Solo ejecuta si hay year, month y token
        staleTime: 5 * 60 * 1000, // Los datos son "frescos" por 5 minutos
    });
}