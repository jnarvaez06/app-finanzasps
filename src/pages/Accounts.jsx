import React, { useState, useEffect } from 'react';
import { API_URL } from '../api/config';

export default function Accounts() {
  const [showModal, setShowModal] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('activo');
  const [accountEditando, setAccountEditando] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'success' | 'danger', texto: '' }

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
    } else {
      fetchAccounts();
    }
  }, []);

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  };

  const fetchAccounts = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_URL}/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        window.location.href = '/';
        return;
      }

      if (!res.ok) {
        throw new Error('Error al obtener cuentas');
      }

      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error('Error cargando cuentas:', error);
      mostrarMensaje('Error al cargar las cuentas', 'danger');
    }
  };

  const abrirModalNueva = () => {
    setAccountEditando(null);
    setDescripcion('');
    setEstado('activo');
    setShowModal(true);
  };

  const abrirModalEditar = (account) => {
    setAccountEditando(account);
    setDescripcion(account.description);
    const estado = account.state ? 'activo' : 'inactivo';
    setEstado(estado);
    setShowModal(true);
  };

  const handleGuardar = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const username = sessionStorage.getItem('username');
      const state = estado === 'activo';

      const nuevaCuenta = {
        description: descripcion,
        state,
        user: username,
      };

      let method = 'POST';
      let addId = '';
      if (accountEditando != null) {
        method = 'PUT';
        addId = `/${accountEditando.idAccount}`;
      }

      const res = await fetch(`${API_URL}/account${addId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaCuenta),
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (!res.ok) {
        throw new Error('Error al guardar cuenta');
      }

      await fetchAccounts();
      setShowModal(false);
      setAccountEditando(null);
      setDescripcion('');
      setEstado('activo');
      mostrarMensaje('Cuenta guardada correctamente');
    } catch (error) {
      console.error('Error al guardar cuenta:', error);
      mostrarMensaje('Error al guardar la cuenta', 'danger');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Maestro de Cuentas</h4>
        <button className="btn btn-success" onClick={abrirModalNueva}>
          <i className="bi bi-plus-lg"></i> Nueva
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
            {accounts.map((acc) => (
              <tr key={acc.idAccount}>
                <td>{acc.idAccount}</td>
                <td>{acc.description}</td>
                <td>
                  <span className={`badge ${acc.state ? 'bg-success' : 'bg-danger'}`}>
                    {acc.state ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => abrirModalEditar(acc)}>
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No hay cuentas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {accountEditando ? 'Editar Cuenta' : 'Nueva Cuenta'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
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
                  <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleGuardar}>
                  {accountEditando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
