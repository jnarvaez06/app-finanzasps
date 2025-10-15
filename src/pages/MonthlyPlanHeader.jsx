import { useNavigate } from "react-router-dom";
import { useCatalogos } from "../hooks/useCatalogos";
import Select from "../components/Select";

export default function MonthlyPlanHeader() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }
    const { months, years } = useCatalogos();
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/monthly_plan");
    };

    return(
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Plan Mensual - Presupuesto</h4>
            </div>
            <form>
                <div className="box-body">
                    <div className="row align-items-end">
                        <div className="col-md-2 mb-3">
                            <label className="form-label">Año</label>
                            <Select
                                options={years}
                                labelKey="description"
                                valueKey="idYear"
                                // {...register("yearId")}
                            />
                        </div>
                        <div className="col-md-2 mb-3">
                            <label className="form-label">Mes</label>
                            <Select
                                options={months}
                                labelKey="description"
                                valueKey="idMonth"
                                // {...register("monthId")}
                            />
                        </div>
                        <div className="col-md-2 mb-3 mr-3">
                            <button 
                                onClick={handleRedirect}
                                className="btn btn-success"
                            >
                                <i className="bi bi-plus-lg"></i> Nuevo
                            </button>&nbsp;
                            <button
                                className="btn btn-success"
                            >
                                <i className="bi bi-search"></i> Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}  