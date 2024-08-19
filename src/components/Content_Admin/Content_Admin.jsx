import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaCheck,FaTimes } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import { getAppointmentsByDate, addAppointment, deleteAppointment, confirmAppointment ,unconfirmAppointment} from '../../Services/FirebaseFunctions';

const Content_Admin = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState({ time: '', occupied: false, confirmed: false });
  const [editing, setEditing] = useState(false);
  const [oldAppointment, setOldAppointment] = useState(null);

  const fetchAppointments = async (date) => {
    const fetchedAppointments = await getAppointmentsByDate(date);
    setAppointments(fetchedAppointments ? fetchedAppointments.shifts : []);
  };

  

  const handleAddAppointment = async () => {
    try {
      await addAppointment(selectedDate, currentAppointment);
      fetchAppointments(selectedDate);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding appointment: ", error);
    }
  };

  const handleDeleteAppointment = async (appointment) => {
    try {
      await deleteAppointment(selectedDate, appointment);
      fetchAppointments(selectedDate);
    } catch (error) {
      console.error("Error deleting appointment: ", error);
    }
  };

  const handleConfirmAppointment = async (appointment) => {
    try {
      await confirmAppointment(selectedDate, appointment);
      fetchAppointments(selectedDate);
    } catch (error) {
      console.error("Error confirming appointment: ", error);
    }
  };

  const handleUnconfirmClick = async (appointment) => {
    try {
      console.log(appointments);
      // Actualiza los turnos para desconfirmar el turno
      const updatedShifts = appointments.map((shift) =>
        shift.time === appointment.time ? { ...shift, name: "", mail: "", occupied: false, confirmed: false } : shift
      );
  
      // Llama a la función para actualizar el documento en Firestore
      await unconfirmAppointment(selectedDate, appointment);
      fetchAppointments(selectedDate); // Vuelve a cargar los turnos actualizados
    } catch (error) {
      console.error("Error unconfirming appointment: ", error);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAppointment({ time: '', occupied: false, confirmed: false });
    setEditing(false);
    setOldAppointment(null);
  };

  const openModal = (appointment = { time: '', occupied: false, confirmed: false }) => {
    setCurrentAppointment(appointment);
    setShowModal(true);
    if (appointment.time) {
      setEditing(true);
      setOldAppointment(appointment);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate]);

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
        <Col md={{ span: 4, offset: 2 }} className="text-end">
          <Button variant="primary" onClick={() => openModal()}>
            <FaPlus /> Add Appointment
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Time</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Confirmed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.time}</td>
                  <td>{appointment.name || 'N/A'}</td>
                  <td>{appointment.mail || 'N/A'}</td>
                  <td>{appointment.occupied ? 'Occupied' : 'Available'}</td>
                  <td>{appointment.confirmed ? 'Yes' : 'No'}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => openModal(appointment)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      className="me-2"
                      onClick={() => handleDeleteAppointment(appointment)}
                    >
                      <FaTrash />
                    </Button>
                    {!appointment.confirmed && (
                      <Button
                        variant="success"
                        onClick={() => handleConfirmAppointment(appointment)}
                      >
                        <FaCheck />
                      </Button>
                    )}
                    {appointment.confirmed && (
                      <Button
                        variant="secondary"
                        onClick={() => handleUnconfirmClick(appointment)}
                      >
                        <FaTimes /> Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Appointment' : 'Add Appointment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter time"
                value={currentAppointment.time}
                onChange={(e) => setCurrentAppointment({ ...currentAppointment, time: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={editing ? handleAddAppointment : handleAddAppointment}>
            {editing ? 'Save Changes' : 'Add Appointment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Content_Admin;
