import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import useAppointments from './useAppointments';
import AppointmentModal from './AppointmentModal';
import AppointmentTable from './Appointment_table';
import MultiAppointmentModal from './MultiAppointmentModal';

const Content_Admin = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMultiModal, setShowMultiModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState({ time: '', occupied: false, confirmed: false });
  const [editing, setEditing] = useState(false);
  const {
    appointments,
    handleAddAppointment,
    handleDeleteAppointment,
    handleConfirmAppointment,
    handleUnconfirmAppointment,
    handleAddMultipleAppointments // Agregar múltiples citas
  } = useAppointments(selectedDate);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAppointment({ time: '', occupied: false, confirmed: false });
    setEditing(false);
  };

  const handleCloseMultiModal = () => {
    setShowMultiModal(false);
  };

  const openModal = (appointment = { time: '', occupied: false, confirmed: false }) => {
    setCurrentAppointment(appointment);
    setShowModal(true);
    if (appointment.time) {
      setEditing(true);
    }
  };

  const openMultiModal = () => {
    setShowMultiModal(true);
  };

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>Appointment Dashboard</h2>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </Col>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {selectedDate &&
          <>
            <Button variant="primary" onClick={() => openModal()}>
            <FaPlus /> Add Appointment
          </Button>
          <Button variant="primary" onClick={openMultiModal}>
            <FaPlus /> Add Daily Appointments
          </Button> 
          </>
          }
          
        </div>
      </Row>
      <Row>
        <Col>
          <AppointmentTable
            appointments={appointments}
            onEdit={openModal}
            onDelete={handleDeleteAppointment}
            onConfirm={handleConfirmAppointment}
            onUnconfirm={handleUnconfirmAppointment}
          />
        </Col>
      </Row>

      <AppointmentModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={editing ? () => handleAddAppointment(currentAppointment) : () => handleAddAppointment(currentAppointment)}
        currentAppointment={currentAppointment}
        setCurrentAppointment={setCurrentAppointment}
        editing={editing}
      />

      <MultiAppointmentModal
        show={showMultiModal}
        onClose={handleCloseMultiModal}
        onSave={handleAddMultipleAppointments} // Añadir múltiples citas
      />
    </Container>
  );
};

export default Content_Admin;
