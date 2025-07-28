import React, { useState, useEffect } from 'react';
import { API_URL } from '../api/config';

export default function Categorias() {
const [showModal, setShowModal] = useState(false);
const [descripcion, setDescripcion] = useState('');
const [estado, setEstado] = useState('activo');
const [categoriaEditando, setCategoriaEditando] = useState(null);
const [categorias, setCategorias] = useState([]);

const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'danger', texto: '' }

useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    } else {
        fetchCategorias();
    }
}, []);

const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
};

const fetchCategorias = async () => {
    try {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${API_URL}/category`, {
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
        mostrarMensaje('Error al cargar las categorías', 'danger');
    }
};

const abrirModalNueva = () => {
    setCategoriaEditando(null);
    setDescripcion('');
    setEstado('activo');
    setShowModal(true);
};

const abrirModalEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setDescripcion(categoria.description);
    const estado = categoria.state ? 'activo' : 'inactivo'
    setEstado(estado);
    setShowModal(true);
};

const handleGuardar = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const username = sessionStorage.getItem('username');
        const state = (estado=='activo');
        const nuevaCategoria = {
            description:descripcion,
            state,
            user:username
        };

        let method = 'POST';
        let addId = '';
        if (categoriaEditando != null) {
            method = 'PUT';
            addId = `/${categoriaEditando.idCategory}`;
        }

        const res = await fetch(`${API_URL}/category${addId}`, {
            method: method,
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevaCategoria),
        });

        if (res.status === 401) {
            window.location.href = '/login';
            return;
        }

        if (!res.ok) {
            throw new Error('Error al guardar categoría');
        }

        await fetchCategorias();
        setShowModal(false);
        setCategoriaEditando(null);
        setDescripcion('');
        setEstado('activo');
        mostrarMensaje('Categoría guardada correctamente');
    } catch (error) {
        console.error('Error al guardar categoría:', error);
        mostrarMensaje('Error al guardar la categoría', 'danger');
    }
};

return (
    <div className="container py-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Maestro de Categorías</h4>
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
            <th>Estado</th>
            <th className="text-center">Acciones</th>
            </tr>
        </thead>
        <tbody>
            {categorias.map((cat) => (
            <tr key={cat.idCategory}>
                <td>{cat.idCategory}</td>
                <td>{cat.description}</td>
                <td>
                <span
                    className={`badge ${
                    cat.state ? 'bg-success' : 'bg-danger'
                    }`}
                >
                    {cat.state ? 'Activo' : 'Inactivo'}
                </span>
                </td>
                <td className="text-center">
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => abrirModalEditar(cat)}
                >
                    <i className="bi bi-pencil"></i> Editar
                </button>
                </td>
            </tr>
            ))}
            {categorias.length === 0 && (
            <tr>
                <td colSpan="4" className="text-center text-muted">
                No hay categorías registradas
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
                {categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
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
                    {categoriaEditando ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
            </div>
        </div>
        </div>
    )}
    </div>
);
}
