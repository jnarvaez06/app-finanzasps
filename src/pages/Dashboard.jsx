import React, { useState } from 'react';
import Modal from '../components/Modal';
import MovimientoForm from '../components/MovimientoForm';
import { useMovimientos } from '../hooks/useMovimientos';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const { guardarMovimiento, loading } = useMovimientos();

  const handleGuardar = async (data) => {
    try {
      const nuevo = await guardarMovimiento(data);
      console.log('Guardado:', nuevo);
      setShowModal(false);
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Nuevo Movimiento</button>
      <Link to="/movements">
        <button>Ver movimientos</button>
      </Link>
      <Link to="/monthly_plan_header">
        <button>Plan Mensual</button>
      </Link>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registrar Movimiento">
        <MovimientoForm
          onSubmit={handleGuardar}
          onCancel={() => setShowModal(false)}
        />
        {loading && <p>Guardando...</p>}
      </Modal>
    </div>
  );
}
