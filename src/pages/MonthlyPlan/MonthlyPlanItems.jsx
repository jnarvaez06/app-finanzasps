// src/pages/MonthlyPlan/MonthlyPlanItems.jsx
import React from "react";

export default function MonthlyPlanItems({
    categoryId,
    items = [],
    categories,
    subCategories,
    onChangeItem,
    onSaveItem,
    onDeleteItem
}) {
    return (
        <div className="card-body">
            {items.length > 0 ? (
                <ul className="list-group">
                    {items.map((item, idx) => (
                        <li key={idx} className="list-group-item">
                            <div className="row align-items-center g-2">
                                {/* Descripción */}
                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={item.description || ""}
                                        onChange={(e) =>
                                            onChangeItem(categoryId, idx, "description", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Monto estimado */}
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.estimated_ammount || ""}
                                        onChange={(e) =>
                                            onChangeItem(categoryId, idx, "estimated_ammount", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Monto real */}
                                <div className="col-md-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.real_ammount || ""}
                                        onChange={(e) =>
                                            onChangeItem(categoryId, idx, "real_ammount", e.target.value)
                                        }
                                    />
                                </div>

                                {/* Categoría */}
                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        value={item.categoryId || ""}
                                        onChange={(e) =>
                                            onChangeItem(categoryId, idx, "categoryId", e.target.value)
                                        }
                                    >
                                        <option value="">Seleccione...</option>
                                        {categories.map((c) => (
                                            <option key={c.idCategory} value={c.idCategory}>
                                                {c.description}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subcategoría */}
                                <div className="col-md-2">
                                    <select
                                        className="form-select"
                                        value={item.subCategoryId || ""}
                                        onChange={(e) =>
                                            onChangeItem(categoryId, idx, "subCategoryId", e.target.value)
                                        }
                                    >
                                        <option value="">Seleccione...</option>
                                        {subCategories
                                            .filter((s) => s.category.idCategory == item.categoryId)
                                            .map((s) => (
                                                <option key={s.idSubCategory} value={s.idSubCategory}>
                                                    {s.description}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Botones */}
                                <div className="col-md-1 d-flex justify-content-end gap-1">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => onSaveItem(categoryId, idx)}
                                    >
                                        <i className="bi bi-save"></i>
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => onDeleteItem(categoryId, idx)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">Sin ítems aún</p>
            )}
        </div>
    );
}