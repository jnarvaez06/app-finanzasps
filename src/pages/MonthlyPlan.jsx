import { useMemo, useState } from "react";
import Modal from "../components/Modal";
import { useForm } from "react-hook-form";
import { API_URL } from '../api/config';
import NumberInput from "../components/NumberInput";
import Select from "../components/Select";
import { useCatalogos } from "../hooks/useCatalogos";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function MonthlyPlan() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }

    const { accounts, categories, subCategories, typesMovement } = useCatalogos();
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [typeModal, setTypeModal] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState({});

    const queryClient = useQueryClient();

    // ---------- API CALLS ----------
    const fetchCategorias = async () => {
        const res = await fetch(`${API_URL}/categoryMonthlyPlan`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener categorías");
        return await res.json();
    };

    const postCategoria = async (data) => {
        const username = sessionStorage.getItem('username');
        const res = await fetch(`${API_URL}/categoryMonthlyPlan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                description: data.nameCategoryPlan,
                type: data.typeCategoryPlan,
                state: true,
                user: username,
            }),
        });
        if (!res.ok) throw new Error("Error al guardar categoría");
        return res.json();
    };

    const putCategoria = async ({ id, ...data }) => {
        const res = await fetch(`${API_URL}/categoryMonthlyPlan/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar categoría");
        return res.json();
    };

    const postItem = async (data) => {
        const username = sessionStorage.getItem('username');
        const res = await fetch(`${API_URL}/monthlyPlan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                description: data.nameItemCategoryPlan,
                estimateAmount: data.estimateAmountCategoryPlan,
                realAmount: data.realAmountCategoryPlan,
                idCategoryMonthlyPlan: selectedCategory,
                user: username,
            }),
        });
        if (!res.ok) throw new Error("Error al guardar ítem");
        return res.json();
    };

    const putItem = async ({ id, ...data }) => {
        const res = await fetch(`${API_URL}/monthlyPlan/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar ítem");
        return res.json();
    };

    const deleteItem = async (id) => {
        const res = await fetch(`${API_URL}/monthlyPlan/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al eliminar ítem");
        return res.json();
    };

    // ---------- QUERIES ----------
    const { isPending, error, data: categorias = [] } = useQuery({
        queryKey: ["categorias"],
        queryFn: fetchCategorias,
    });

    const { data: monthlyPlans = [] } = useQuery({
        queryKey: ["monthlyPlans"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/monthlyPlan/2025/9`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!res.ok) throw new Error("Error al cargar el plan");
            const data = await res.json();
            return Array.isArray(data) ? data : [data];
        }
    });

    console.log("categorias", categorias);
    console.log("monthlyPlans", monthlyPlans);


    // ---------- MEMO ----------
    const itemsByCategory = useMemo(() => {
        if (!Array.isArray(monthlyPlans) || monthlyPlans.length === 0) return {};
        return monthlyPlans.reduce((acc, plan) => {
            acc[plan.categoryMonthlyPlanId] = plan.items || [];
            return acc;
        }, {});
    }, [monthlyPlans]);

    // ---------- MUTATIONS ----------
    const mutationCategory = useMutation({
        mutationFn: postCategoria,
        onSuccess: () => {
            queryClient.invalidateQueries(["categorias"]);
            setShowModal(false);
        },
    });

    const mutationItem = useMutation({
        mutationFn: postItem,
        onSuccess: () => {
            queryClient.invalidateQueries(["monthlyPlans"]);
            setShowModal(false);
        },
    });

    const mutationUpdateCategory = useMutation({
        mutationFn: putCategoria,
        onSuccess: () => queryClient.invalidateQueries(["categorias"]),
    });

    const mutationUpdateItem = useMutation({
        mutationFn: putItem,
        onSuccess: () => queryClient.invalidateQueries(["monthlyPlans"]),
    });

    const mutationDeleteItem = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => queryClient.invalidateQueries(["monthlyPlans"]),
    });

    // ---------- FORM ----------
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        if (typeModal === "category") {
            mutationCategory.mutate(data);
        } else if (typeModal === "item") {
            mutationItem.mutate(data);
            // handleAddItem(data);
        }
    };

    const handleAddItem = (data) => {
        const newItem = {
            idMonthlyPlanItem: Date.now(), // id temporal
            description: data.nameItemCategoryPlan,
            estimateAmount: data.estimateAmountCategoryPlan,
            realAmount: data.realAmountCategoryPlan,
        };
    
        setItems((prev) => ({
            ...prev,
            [selectedCategory]: [...(prev[selectedCategory] || []), newItem]
        }));
    
        setShowModal(false);
    };

    // ---------- UI ----------
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Plan Mensual</h4>
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

            {isPending && <strong>Cargando...</strong>}
            {error && <p>Ha habido un error!</p>}

            {categorias.map((cat) => (
                <div className="card mb-2" key={cat.idCategoryMonthlyPlan}>
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
                        {itemsByCategory[cat.idCategoryMonthlyPlan]?.length > 0 ? (
                            itemsByCategory[cat.idCategoryMonthlyPlan].map((item) => (
                            <div
                                key={item.idItemMonthlyPlan}
                                className="d-flex justify-content-between align-items-center border-bottom py-2"
                            >
                                <span>
                                {item.description} - Est: {item.estimateAmount} / Real: {item.realAmount}
                                </span>
                                <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                    // Aquí iría la mutación DELETE
                                }}
                                >
                                <i className="bi bi-trash"></i>
                                </button>
                            </div>
                            ))
                        ) : (
                            <p className="text-muted">Sin ítems aún</p>
                        )}
                    </div>   
                </div>
            ))}

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={titleModal}>
                <div>
                    {htmlModalCategoryMontlyPlan(typeModal, { register, handleSubmit, watch, onSubmit, errors, accounts, categories, subCategories, typesMovement})}
                </div>
            </Modal>
        </div>
    );
}

// ---------- COMPONENTES DE FORM ----------
const htmlModalCategoryMontlyPlan = (type, formProps) => {
    switch (type) {
        case "category":
            return htmlCategoryPlan(formProps);
        case "item":
            return htmlItemCategoryPlan(formProps);
        default:
            return null;
    }
};

const htmlCategoryPlan = ({ register, handleSubmit, onSubmit, errors, typesMovement }) => {
    const defaultMessage = "Campo Requerido";
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
};

const htmlItemCategoryPlan = ({ register, handleSubmit, watch, onSubmit, errors, categories, subCategories}) => {
    const defaultMessage = "Campo Requerido";

    const categoryId = watch("categoryId");

    const subcategoriasFiltradas = Array.isArray(subCategories)
        ? subCategories.filter((sc) => sc.category.idCategory == categoryId)
        : [];
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                    type="text"
                    className="form-control"
                    {...register("nameItemCategoryPlan", { required: defaultMessage })}
                />
                {errors.nameItemCategoryPlan && <div className="text-danger">{errors.nameItemCategoryPlan.message}</div>}
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Valor Estimado</label>
                    <NumberInput
                        className="form-control"
                        placeholder="Ingrese Valor"
                        autoComplete="off"
                        {...register("estimateAmountCategoryPlan", { required: defaultMessage })}
                    />
                    {errors.estimateAmountCategoryPlan && <div className="text-danger">{errors.estimateAmountCategoryPlan.message}</div>}
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Valor Real</label>
                    <NumberInput
                        className="form-control"
                        placeholder="Ingrese Valor"
                        autoComplete="off"
                        {...register("realAmountCategoryPlan", { required: defaultMessage })}
                    />
                    {errors.realAmountCategoryPlan && <div className="text-danger">{errors.realAmountCategoryPlan.message}</div>}
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Categoria</label>
                    <Select
                        options={categories}
                        labelKey='description'
                        valueKey='idCategory'
                        {...register("categoryId")}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Sub Categoria</label>
                    <Select
                        options={subcategoriasFiltradas}
                        labelKey='description'
                        valueKey='idSubCategory'
                        disabled={!categoryId}
                        placeholder={!categoryId ? "Seleccione Categoria..." : "Seleccione..."}
                        {...register("subCategoryId")}
                    />
                </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-success">Agregar</button>
            </div>
        </form>
    );
};
