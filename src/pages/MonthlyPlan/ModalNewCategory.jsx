import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../../api/config";
import { useCatalogos } from "../../hooks/useCatalogos";
import Select from "../../components/Select";

export default function ModalNewCategoryMonthlyPlan() {

    const defaultMessage = "Campo Requerido";
    const { typesMovement } = useCatalogos();

    //MANEJA LOS ESTADOS POR DEFECTO
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            nameCategoryPlan: "",
            typeCategoryPlan: ""
        }
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const username = sessionStorage.getItem('username');
            const response = await fetch(`${API_URL}/categoryMonthlyPlan`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    description: data.nameCategoryPlan,
                    type: data.typeCategoryPlan,
                    state: true,
                    user: username,
                })
            });
            if (!response.ok) throw new Error('Error al enviar');
            return response.json();
        },
        onSuccess: () => {
            alert('Categoria guardada exitosamente');
        },
        onError: (error) => {
            alert('Error: ' + error.message);
        }
    });

    const onSubmit = (data) => {
        console.log('Datos del formulario:', data);
        mutation.mutate(data);
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                    type="text"
                    className="form-control"
                    {...register("nameCategoryPlan", { required: defaultMessage })}
                />
                {errors.nameCategoryPlan && <div className="text-danger">{errors.nameCategoryPlan.message}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label">Tipo</label>
                <Select
                    options={typesMovement}
                    labelKey="description"
                    valueKey="idType"
                    {...register("typeCategoryPlan", { required: defaultMessage })}
                />
                {errors.typeCategoryPlan && <div className="text-danger">{errors.typeCategoryPlan.message}</div>}
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-success">Guardar</button>
            </div>
        </form>
    );
}