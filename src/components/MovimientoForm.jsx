import React, { useState } from 'react';
import { useCatalogos } from '../hooks/useCatalogos';
import Select from './Select';
import NumberInput from './NumberInput';

export default function MovimientoForm({ onSubmit, onCancel, initialData = {} }) {
  const [descripcion, setDescripcion] = useState(initialData.descripcion || '');
  const [monto, setMonto] = useState(initialData.monto || '');
  const [fecha, setFecha] = useState(initialData.fecha || new Date().toISOString().slice(0, 10));
  const {accounts, categories, subCategories, typesMovement} = useCatalogos();
  const [accountId, setAccountId] = useState(initialData.accountId || ''); 
  const [categoryId, setCategoryId] = useState(initialData.categoryId || '');
  const [subCategoryId, setSubCategoryId] = useState(initialData.subCategoryId || '');
  const [typeMovementId, setTypeMovementId] = useState(initialData.typeMovementId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      descripcion,
      monto: parseFloat(monto),
      fecha,
      accountId,
      categoryId,
      subCategoryId,
      typeMovementId
    });
  };

  const subcategoriasFiltradas = subCategories.filter(
    (sc) => sc.category.idCategory == categoryId
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className='row'>
        <div className="col-md-6 mb-3">
          <label className="form-label">Cuenta</label>
          <Select
            options={accounts}
            value={accountId}
            onChange={(val) => setAccountId(val)}
            labelKey='description'
            valueKey='idAccount'
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Tipo Movimiento</label>
          <Select
            options={typesMovement}
            value={typeMovementId}
            onChange={(val) => setTypeMovementId(val)}
            labelKey='description'
            valueKey='idType'
          />
        </div>
      </div>

      <div className='row'>
        <div className="col-md-6 mb-3">
          <label className="form-label">Monto</label>
          <NumberInput
            value={monto}
            onChange={setMonto}
            className="form-control"
            placeholder="Ingrese Valor"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <input
          type="text"
          className="form-control"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
      </div>

      <div className='row'>
        <div className="col-md-6 mb-3">
          <label className="form-label">Categoria</label>
          <Select
            options={categories}
            value={categoryId}
            onChange={(val) => setCategoryId(val)}
            labelKey='description'
            valueKey='idCategory'
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Sub Categoria</label>
          <Select
            options={subcategoriasFiltradas}
            value={subCategoryId}
            onChange={setSubCategoryId}
            labelKey='description'
            valueKey='idSubCategory'
            disabled={!categoryId}
            placeholder={!categoryId ? "Seleccione Categoria..." : "Seleccione..."}
          />
        </div>
      </div>


      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </div>
    </form>
  );
}
