import React, { useState } from 'react';
import Modal from '../components/Modal';
import MovimientoForm from '../components/MovimientoForm';
import { useMovimientos } from '../hooks/useMovimientos';

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
