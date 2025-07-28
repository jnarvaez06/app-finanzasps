import React, { useState, useEffect } from 'react';
import { API_URL } from '../api/config';
import useCategorias from '../hooks/useCategorias';

export default function Subcategories() {
  const [showModal, setShowModal] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('activo');
  const [idCategoria, setIdCategoria] = useState('');
  const [subcategoriaEditando, setSubcategoriaEditando] = useState(null);
  const [subcategorias, setSubcategorias] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  const { categorias, loading, error, refetch } = useCategorias();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
    } else {
      fetchSubcategorias();
    }
  }, []);

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const fetchSubcategorias = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_URL}/subcategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        window.location.href = '/';
        return;
      }

      const data = await res.json();
      setSubcategorias(data);
    } catch (error) {
      console.error('Error cargando subcategorías:', error);
      mostrarMensaje('Error al cargar las subcategorías', 'danger');
    }
  };

  const abrirModalNueva = () => {
    setSubcategoriaEditando(null);
    setDescripcion('');
    setEstado('activo');
    setIdCategoria('');
    setShowModal(true);
  };

  const abrirModalEditar = (subcat) => {
    setSubcategoriaEditando(subcat);
    setDescripcion(subcat.description);
    setEstado(subcat.state ? 'activo' : 'inactivo');
    setIdCategoria(subcat.category?.idCategory || '');
    setShowModal(true);
  };

  const handleGuardar = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const username = sessionStorage.getItem('username');
      const state = estado === 'activo';

      const nuevaSubcategoria = {
        description: descripcion,
        state,
        user: username,
        idCategory: idCategoria,
      };

      let method = 'POST';
      let addId = '';
      if (subcategoriaEditando != null) {
        method = 'PUT';
        addId = `/${subcategoriaEditando.idSubCategory}`;
      }

      const res = await fetch(`${API_URL}/subcategory${addId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaSubcategoria),
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        throw new Error('Error al guardar subcategoría');
      }

      await fetchSubcategorias();
      setShowModal(false);
      setSubcategoriaEditando(null);
      setDescripcion('');
      setEstado('activo');
      setIdCategoria('');
      mostrarMensaje('Subcategoría guardada correctamente');
    } catch (error) {
      console.error('Error al guardar subcategoría:', error);
      mostrarMensaje('Error al guardar la subcategoría', 'danger');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Maestro de Subcategorías</h4>
        <button className="btn btn-success" onClick={abrirModalNueva}>
          <i className="bi bi-plus-lg"></i> Nuevo
        </button>
      </div>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo}`} role="alert">
          {mensaje.texto}
        </div>
      )}

      <div className="table-responsive bg-body rounded shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subcategorias.map((sub) => (
              <tr key={sub.idSubCategory}>
                <td>{sub.idSubCategory}</td>
                <td>{sub.description}</td>
                <td>{sub.category?.description || '-'}</td>
                <td>
                  <span
                    className={`badge ${sub.state ? 'bg-success' : 'bg-danger'}`}
                  >
                    {sub.state ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => abrirModalEditar(sub)}
                  >
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                </td>
              </tr>
            ))}
            {subcategorias.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No hay subcategorías registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {subcategoriaEditando ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    value={idCategoria}
                    onChange={(e) => setIdCategoria(e.target.value)}
                  >
                    <option value="">Seleccione una categoría</option>
                    {loading && <option>Cargando...</option>}
                    {!loading &&
                      categorias.map((cat) => (
                        <option key={cat.idCategory} value={cat.idCategory}>
                          {cat.description}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleGuardar}>
                  {subcategoriaEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
