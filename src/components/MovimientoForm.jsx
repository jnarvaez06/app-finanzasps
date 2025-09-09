import React from 'react';
import { useForm } from "react-hook-form";
import { useCatalogos } from '../hooks/useCatalogos';
import Select from './Select';
import NumberInput from './NumberInput';

export default function MovimientoForm({ onSubmit, onCancel, initialData = {} }) {
  const { accounts, categories, subCategories, typesMovement } = useCatalogos();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      descripcion: initialData.descripcion || "",
      monto: initialData.monto || "",
      fecha: initialData.fecha || new Date().toISOString().slice(0, 10),
      accountId: initialData.accountId || "",
      categoryId: initialData.categoryId || "",
      subCategoryId: initialData.subCategoryId || "",
      typeMovementId: initialData.typeMovementId || "",
      isEdit : initialData.isEdit || false,
      idMovement: initialData.idMovement || ""
    },
  });

  const categoryId = watch("categoryId");
  const subcategoriasFiltradas = Array.isArray(subCategories)
  ? subCategories.filter((sc) => sc.category.idCategory == categoryId)
  : [];

  const handleFormSubmit = (data) => {
    console.log("Datos enviados:", data);
    onSubmit(data);
  };

  const defaultMessage = 'Campo Requerido';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className='row'>
        <div className="col-md-6 mb-3">
          <label className="form-label">Cuenta</label>
          <Select
            options={accounts}
            labelKey='description'
            valueKey='idAccount'
            {...register("accountId", {
              required: defaultMessage,
            })}
          />
          {errors.accountId && (
            <div className="text-danger">{errors.accountId.message}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Tipo Movimiento</label>
          <Select
            options={typesMovement}
            labelKey='description'
            valueKey='idType'
            {...register("typeMovementId", {
              required: defaultMessage,
            })}
          />
          {errors.typeMovementId && (
            <div className="text-danger">{errors.typeMovementId.message}</div>
          )}
        </div>
      </div>

      <div className='row'>
        <div className="col-md-6 mb-3">
          <label className="form-label">Monto</label>
          <NumberInput
            className="form-control"
            placeholder="Ingrese Valor"
            autoComplete="off"
            {...register("monto", {
              required: defaultMessage,
            })}
          />
          {errors.monto && (
            <div className="text-danger">{errors.monto.message}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            {...register("fecha", {
              required: defaultMessage,
            })}
          />
          {errors.fecha && (
            <div className="text-danger">{errors.fecha.message}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <input
          type="text"
          id="descripcion"
          className="form-control"
          {...register("descripcion", {
            required: defaultMessage
          })}
        />
        {errors.descripcion && (
          <div className="text-danger">{errors.descripcion.message}</div>
        )}
      </div>

      <div className='row'>
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
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-success">
          {initialData.isEdit ? 'Actualizar' : 'Guardar'}
        </button>
        <button type="button" className="btn btn-default" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
