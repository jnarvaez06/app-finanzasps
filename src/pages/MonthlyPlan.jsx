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

    const { accounts, categories, subCategories, typesMovement, years, months } = useCatalogos();
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

    // ---------- MEMO ----------
    const itemsByCategory = useMemo(() => {
        const combined = {}
    
        if (Array.isArray(monthlyPlans)) {
            monthlyPlans.forEach((plan) => {
                combined[plan.categoryMonthlyPlanId] = plan.items || []
            })
        }
    
        Object.entries(items).forEach(([catId, newItems]) => {
            combined[catId] = [...(combined[catId] || []), ...newItems]
        })
    
        return combined
    }, [monthlyPlans, items])

    // ---------- MUTATIONS ----------
    const mutationCategory = useMutation({
        mutationFn: postCategoria,
        onSuccess: () => {
            queryClient.invalidateQueries(["categorias"]);
            setShowModal(false);
        },
    });

    // ---------- FORM ----------
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        if (typeModal === "category") {
            mutationCategory.mutate(data);
        } else if (typeModal === "item") {
            handleAddItem(data);
        }
    };

    const handleAddItem = (data) => {        
        const newItem = {
            idItemMonthlyPlan: Date.now(), // id temporal
            description: data.nameItemCategoryPlan,
            estimateAmount: data.estimateAmountCategoryPlan,
            realAmount: data.realAmountCategoryPlan,
            category: data.categoryId,
            subCategory: data.subCategoryId,
            isRecurring : data.isRecurring
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
                    />
                </div>

                <div className="col-auto d-flex align-items-center gap-2">
                    <label className="form-label mb-0">Mes:</label>
                    <Select
                        options={months}
                        labelKey="description"
                        valueKey="idMonth"
                        className="form-control"
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
                            <table className="table table-sm align-middle">
                                <thead>
                                    <tr>
                                    <th>Descripción</th>
                                    <th>Estimado</th>
                                    <th>Real</th>
                                    <th>Categoría</th>
                                    <th>Subcategoría</th>
                                    <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsByCategory[cat.idCategoryMonthlyPlan].map((item, idx) => (
                                    <tr key={item.idItemMonthlyPlan || idx}>
                                        <td>{item.description}</td>
                                        <td style={{ width: "120px" }}>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={item.estimateAmount}
                                                onChange={(e) => handleUpdateItem(cat.idCategoryMonthlyPlan, item.idMonthlyPlanItem, "estimateAmount", e.target.value)}
                                            />
                                        </td>
                                        <td style={{ width: "120px" }}>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={item.realAmount}
                                                onChange={(e) => handleUpdateItem(cat.idCategoryMonthlyPlan, item.idMonthlyPlanItem, "realAmount", e.target.value)}
                                            />
                                        </td>
                                        <td style={{ width: "160px" }}>
                                            <select
                                                className="form-select form-select-sm"
                                                value={item.category}
                                                onChange={(e) =>
                                                    handleUpdateItem(cat.idCategoryMonthlyPlan, item.idMonthlyPlanItem, "category", e.target.value)
                                                }
                                            >
                                                {categories.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ width: "160px" }}>
                                            <select
                                                className="form-select form-select-sm"
                                                value={item.subCategory || ""}
                                                onChange={(e) =>
                                                handleUpdateItem(cat.idCategoryMonthlyPlan, item.idMonthlyPlanItem, "subCategory", e.target.value)
                                                }
                                            >
                                                <option value="">Seleccione</option>
                                                {subCategories
                                                .filter((s) => s.categoryId === item.category)
                                                .map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                    {s.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        
                                        <td className="text-end">
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteItem(cat.idCategoryMonthlyPlan, item.idMonthlyPlanItem)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
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
            <div className="row">
                <div className="col-md6 mb-3">
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input"
                            type="checkbox"
                            {...register("isRecurring")}
                        />
                        <label className="form-check-label">Registro Recurrente</label>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-success">Agregar</button>
            </div>
        </form>
    );
};
