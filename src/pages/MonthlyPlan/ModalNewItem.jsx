import { useForm } from "react-hook-form";
import { useCatalogos } from "../../hooks/useCatalogos";
import NumberInput from "../../components/NumberInput";
import Select from "../../components/Select";

export default function ModalNewItemMonthlyPlan() {
    const { accounts, categories, subCategories, typesMovement } = useCatalogos();

    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();

    const onSubmit = (data) => {
        console.log("Aqui procesa:", data);
        reset();
    };

    const categoryId = watch("categoryId");
    const subcategoriasFiltradas = Array.isArray(subCategories)
    ? subCategories.filter((sc) => sc.category.idCategory == categoryId)
    : [];

    const defaultMessage = 'Campo Requerido';

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-12 mb-3">
                    <label htmlFor="description">Descripción</label>
                    <input
                        type="text"
                        id="description"
                        className="form-control"
                        {...register("description", {required: "Descripción es requerida"})}
                    />
                    {errors.description && (
                        <span className="text-danger">{errors.description.message}</span>
                    )}
                </div>

                <div className="col-md-6 mb-3">
                    <label htmlFor="estimated-ammount">Monto Estimado</label>
                    <NumberInput
                        className="form-control"
                        placeholder="Ingrese Valor"
                        autoComplete="off"
                        {...register("estimated_ammount", {required: "Monto estimado es requerido"})}
                    />
                    {errors.estimated_ammount && (
                        <span className="text-danger">{errors.estimated_ammount.message}</span>
                    )}
                </div>

                <div className="col-md-6 mb-3">
                    <label htmlFor="estimated-ammount">Monto Real</label>
                    <NumberInput
                        className="form-control"
                        placeholder="Ingrese Valor"
                        autoComplete="off"
                        {...register("real_ammount", {required: "Monto real es requerido"})}
                    />
                    {errors.real_ammount && (
                        <span className="text-danger">{errors.real_ammount.message}</span>
                    )}
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Categoria</label>
                    <Select
                        options={categories}
                        labelKey='description'
                        valueKey='idCategory'
                        {...register("categoryId", {
                            required: defaultMessage,
                        })}
                    />
                    {errors.categoryId && (
                        <div className="text-danger">{errors.categoryId.message}</div>
                    )}
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

                <div className="col-md-6 mb-3">
                    <div className="form-check form-check-inline">
                        <input
                            type="checkbox"
                            id="isActive"
                            className="form-check-input"
                            {...register("isActive")}
                        />
                        <label htmlFor="isActive" className="form-check-label">Activo</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input
                            type="checkbox"
                            id="isRecurrent"
                            className="form-check-input"
                            {...register("isRecurrent")}
                        />
                        <label htmlFor="isRecurrent" className="form-check-label">Recurrente</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary"> Agregar </button>
            </div>
        </form>
    );
}