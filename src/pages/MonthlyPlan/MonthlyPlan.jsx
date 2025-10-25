import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Select from "../../components/Select";
import { useCatalogos } from "../../hooks/useCatalogos";
import Modal from "../../components/Modal";
import ModalNewCategoryMonthlyPlan from "./ModalNewCategory";
import { useState } from "react";
import ModalNewItemMonthlyPlan from "./ModalNewItem";
import { useCategoryMonthlyPlan } from "./hooks/useCategoryMonthlyPlan";

export default function MonthlyPlan() {
    const { accounts, categories, subCategories, typesMovement, years, months } = useCatalogos();
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [typeModal, setTypeModal] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState({});

    //MANEJA LOS ESTADOS POR DEFECTO
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            year: "",
            month: "",
            account: "",
            category: "",
            subCategory: "",
            typeMovement: "",
            amount: ""
        }
    });

    const {data: categoryMonthlyPlan, isLoading, isError, error} = useCategoryMonthlyPlan();

    // Mutation de React Query para enviar al backend
    const mutation = useMutation({
        mutationFn: async (data) => {
            const response = await fetch('/api/monthly-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error al enviar');
            return response.json();
        },
        onSuccess: () => {
            alert('Plan mensual guardado exitosamente');
        },
        onError: (error) => {
            alert('Error: ' + error.message);
        }
    });

    const onSubmit = (data) => {
        console.log('Datos del formulario:', data);
        mutation.mutate(data);
    };

    return(
        <div className="container py-4">
            <div className="row align-items-end mb-3">
                <div className="col-auto">
                    <h4 className="mb-0">Plan Mensual</h4>
                </div>
                <div className="col-auto d-flex align-items-center gap-2">
                    <label className="form-label mb-0">Año:</label>
                    <Select
                        options={years}
                        labelKey="description"
                        valueKey="idYear"
                        className="form-control"
                        {...register("year", { required: "El año es requerido" })}
                        error={errors.year?.message}
                    />
                </div>

                <div className="col-auto d-flex align-items-center gap-2">
                    <label className="form-label mb-0">Mes:</label>
                    <Select
                        options={months}
                        labelKey="description"
                        valueKey="idMonth"
                        placeholder="Seleccione mes"
                        {...register("month", { required: "El mes es requerido" })}
                        error={errors.month?.message}
                    />
                </div>

                <div className="col d-flex justify-content-end">
                    <button
                    className="btn btn-success"
                    onClick={() => {
                        setShowModal(true);
                        setTitleModal("Registrar categoría Plan Mensual");
                        setTypeModal("category");
                    }}
                    >
                    <i className="bi bi-plus-lg"></i> Nueva Categoría
                    </button>
                </div>
            </div>

            {/* CARDS */}
            {isLoading && (
                <div className="text-center my-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            )}

            {isError && (
                <div className="alert alert-danger" role="alert">
                    {error.message}
                </div>
            )}
            {categoryMonthlyPlan && categoryMonthlyPlan.length > 0 && (
            <div className="row g-3 mb-4">
                {categoryMonthlyPlan.map((cat) => (
                    <div key={cat.idCategoryMonthlyPlan} className="card mb-2">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <div>
                                {cat.description}
                            </div>
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-success"
                                    onClick={() => {
                                        setShowModal(true);
                                        setTitleModal(`Registrar ítem en ${cat.description}`);
                                        setTypeModal("item");
                                        setSelectedCategory(cat.idCategoryMonthlyPlan);
                                    }}
                                >
                                    <i className="bi bi-plus-lg"></i> Nuevo Registro
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                                <p className="text-muted">Sin ítems aún</p>
                        </div>
                    </div>
                ))}
            </div>
            )}

            {/* MODALS */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={titleModal}>
                {typeModal == 'category' ? <ModalNewCategoryMonthlyPlan /> : <ModalNewItemMonthlyPlan />}
            </Modal>

        </div>
    );
}