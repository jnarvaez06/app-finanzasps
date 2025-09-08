import { useForm } from "react-hook-form";
import Select from "../components/Select";
import { useCatalogos } from "../hooks/useCatalogos";
import { API_URL } from '../api/config';
import { useState } from "react";

export default function Movements() {
    const { accounts, categories, subCategories, months, years } = useCatalogos();
    const currentDate = new Date();

    const [movements, setMovements] = useState([]);
    const{register, handleSubmit, watch} = useForm({
        defaultValues:{
            yearId: currentDate.getFullYear(),
            monthId: currentDate.getMonth() + 1,
            accountId: "",
            categoryId: "",
            subCategoryId: "",
        }
    });

    const categoryId = watch("categoryId");
    const subcategoriasFiltradas = Array.isArray(subCategories)
        ? subCategories.filter((sc) => sc.category.idCategory == categoryId)
        : [];

    const onSubmit = async (filters) =>{
        try {
            const token = sessionStorage.getItem('token');
            const username = sessionStorage.getItem('username');

            const postData = {
				...filters,
                year:filters.yearId,
                month:filters.monthId,
				user:username
			};

            console.log(postData)
            const response = await fetch(`${API_URL}/reports/movement`, {
                method: "POST",
                headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
                body: JSON.stringify(postData),
            });
            if (!response.ok) throw new Error("Error al consultar movimientos");
            const data = await response.json();
            setMovements(data); 
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Movimientos</h4>
                <button className="btn btn-success">
                    <i className="bi bi-plus-lg"></i> Nuevo
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="box-body">
                    <div className="row">
                        <div className="col-md-2 mb-3">
                            <label className="form-label">Año</label>
                            <Select
                                options={years}
                                labelKey="description"
                                valueKey="idYear"
                                {...register("yearId")}
                            />
                        </div>
                        <div className="col-md-2 mb-3">
                            <label className="form-label">Mes</label>
                            <Select
                                options={months}
                                labelKey="description"
                                valueKey="idMonth"
                                {...register("monthId")}
                            />
                        </div>
                        <div className="col-md-2 mb-3">
                            <label className="form-label">Cuenta</label>
                            <Select
                                options={accounts}
                                labelKey='description'
                                valueKey='idAccount'
                                {...register("accountId")}
                            />
                        </div>
                        
                        <div className="col-md-2 mb-3">
                            <label className="form-label">Categoria</label>
                            <Select
                                options={categories}
                                labelKey='description'
                                valueKey='idCategory'
                                {...register("categoryId")}
                            />
                        </div>
                        <div className="col-md-2 mb-3">
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
                        <div className="col-md-2 mb-3">
                            <label className="form-label">&nbsp;</label>
                            <button className="btn btn-success d-block" type="submit" >Buscar</button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="table-responsive bg-body rounded shadow-sm p-3">
                <table className="table table-hover align-middled">
                    <thead className="table-light">
                        <tr>
                            <th className="text-center">Cuenta</th>
                            <th className="text-center">Categoria</th>
                            <th className="text-center">SubCategoria</th>
                            <th className="text-center">Descripción</th>
                            <th className="text-center">Monto</th>
                            <th className="text-center">Fecha</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.length > 0 ? (
                            <>
                                {movements.map((mov) => (
                                    <tr
                                        key={mov.idMovement}
                                        className={mov.type === "I" ? "table-success" : "table-danger"}
                                    >
                                        <td>{mov.accountDescription}</td>
                                        <td>{mov.categoryDescription}</td>
                                        <td>{mov.subCategoryDescription}</td>
                                        <td>{mov.description}</td>
                                        <td className="text-end">{mov.value}</td>
                                        <td>{mov.dateMovement}</td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-primary me-2">
                                                Editar
                                            </button>
                                            <button className="btn btn-sm btn-warning">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="fw-bold table-light">
                                    <td colSpan="4" className="text-end">
                                        Total:
                                    </td>
                                    <td>
                                        {movements.reduce((acc, m) => {
                                            const value = Number(m.value || 0);
                                            return m.type === "I" ? acc + value : acc - value;
                                        }, 0)}
                                    </td>
                                    <td colSpan="2"></td>
                                </tr>
                            </>
                            
                        ) : (
                            <tr>
                                <td colSpan="100%" className="text-center">
                                    No hay movimientos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}