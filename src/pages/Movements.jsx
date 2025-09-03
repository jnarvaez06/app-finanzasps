import { useForm } from "react-hook-form";
import Select from "../components/Select";
import { useCatalogos } from "../hooks/useCatalogos";

export default function Movements() {
    const { accounts, categories, subCategories, months, years } = useCatalogos();
    const currentDate = new Date();

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

    return(
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Movimientos</h4>
                <button className="btn btn-success">
                    <i className="bi bi-plus-lg"></i> Nuevo
                </button>
            </div>
            <form onSubmit={handleSubmit}>
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
                        <div className="col-md-2 mb-3"><br/>
                            <button className="btn btn-success" type="button">Buscar</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}