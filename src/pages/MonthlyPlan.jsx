import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { useForm } from "react-hook-form";
import { API_URL } from '../api/config';
import NumberInput from "../components/NumberInput";
import Select from "../components/Select";
import { useCatalogos } from "../hooks/useCatalogos";

export default function MonthlyPlan(params) {
    const { accounts, categories, subCategories, typesMovement } = useCatalogos();
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [typeModal, setTypeModal] = useState("");
    const [categorias, setCategorias] = useState([]);

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            window.location.href = '/';
        } else {
            fetchCategorias();
        }
    }, []);

    const{
        register,
        handleSubmit,
        watch,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues:{
            nameCategoryPlan: "",
        }
    });

    const fetchCategorias = async () => {
        try {
        const res = await fetch(`${API_URL}/categoryMonthlyPlan`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    
        if (res.status === 401) {
            window.location.href = '/';
            return;
        }
    
        if (!res.ok) {
            throw new Error('Error al obtener categorías');
        }
    
        const data = await res.json();
            setCategorias(data);
        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    };


    const onSubmit = async(data) => {
        console.log(data)
        const username = sessionStorage.getItem('username');

        const postData = {
            description : data.nameCategoryPlan,
            type:data.typeCategoryPlan,
            state: true,
            user:username
        };

        const res = await fetch(`${API_URL}/categoryMonthlyPlan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });

        if (res.status === 401) {
            window.location.href = '/login';
            return;
        }

        if (!res.ok) {
            throw new Error('Error al guardar categoría');
        }
        setShowModal(false);
        await fetchCategorias();
    }

    return(
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
            {categorias.map((cat) => (
                <div className="card mb-2" key={cat.idCategoryMonthlyPlan}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        {cat.description}
                        <button 
                            className="btn btn-success"
                            onClick={() => {
                                setShowModal(true);
                                setTitleModal(`Registrar ${cat.description}`);
                                setTypeModal("item");
                            }}
                        >
                            <i className="bi bi-plus-lg"></i> Nuevo Registro
                        </button>
                    </div>
                    <div className="card-body">
                        Agregue cositas
                    </div>   
                </div>
            ))}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={titleModal}>
                <div>
                    {htmlModalCategoryMontlyPlan(typeModal, { register, handleSubmit, onSubmit, errors, accounts, categories, subCategories, typesMovement})}
                </div>
            </Modal>
        </div>
    );
}

const htmlModalCategoryMontlyPlan = (type, formProps) => {
    let html = "";
    switch (type) {

        case "category":
            html = htmlCategoryPlan(formProps)
            break;

        case "item":
            html = htmlItemCategoryPlan(formProps)
            break;

        default:
            break;
    }

    return html;
}

const htmlCategoryPlan = ({ register, handleSubmit, onSubmit, errors, accounts, categories, subCategories, typesMovement}) => {
    const defaultMessage = 'Campo Requerido';

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                    type="text"
                    className="form-control"
                    {...register("nameCategoryPlan", {
                        required: defaultMessage,
                    })}
                />
                {errors.nameCategoryPlan && (
                    <div className="text-danger">{errors.nameCategoryPlan.message}</div>
                )}
            </div>
            <div className="mb-3">
                <label className="form-label">Tipo</label>
                <Select
                    options={typesMovement}
                    labelKey='description'
                    valueKey='idType'
                    {...register("typeCategoryPlan", {
                        required: defaultMessage,
                    })}
                />
                {errors.typeCategoryPlan && (
                    <div className="text-danger">{errors.typeCategoryPlan.message}</div>
                )}
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-success">
                    Guardar
                </button>
            </div>
        </form>
    )
}

const htmlItemCategoryPlan = ({ register, handleSubmit, onSubmit, errors, accounts, categories, subCategories, typesMovement}) => {
    const defaultMessage = 'Campo Requerido';

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                    type="text"
                    className="form-control"
                    {...register("nameItemCategoryPlan", {
                        required: defaultMessage,
                    })}
                />
                {errors.nameItemCategoryPlan && (
                    <div className="text-danger">{errors.nameItemCategoryPlan.message}</div>
                )}
            </div>
            <div className='row'>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Valor Estimado</label>
                    <NumberInput
                        className="form-control"
                        placeholder="Ingrese Valor"
                        autoComplete="off"
                        {...register("estimateAmountCategoryPlan", {
                            required: defaultMessage,
                        })}
                    />
                    {errors.estimateAmountCategoryPlan && (
                        <div className="text-danger">{errors.estimateAmountCategoryPlan.message}</div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Valor Real</label>
                    <NumberInput
                        className="form-control"
                        placeholder="Ingrese Valor"
                        autoComplete="off"
                        {...register("realAmountCategoryPlan", {
                            required: defaultMessage,
                        })}
                    />
                    {errors.realAmountCategoryPlan && (
                        <div className="text-danger">{errors.realAmountCategoryPlan.message}</div>
                    )}
                </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-success">
                    Guardar
                </button>
            </div>
        </form>
    )
}