import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
//import { getAppointmentsByDate, addAppointment, deleteAppointment, updateAppointment } from "../../Services/firebaseFunctions";

const Content_Admin = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState({ time: '', occupied: false });

  const fetchAppointments = async (date) => {
    try {
      const fetchedAppointments = await getAppointmentsByDate(date);
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error("Error fetching appointments: ", error);
    }
  };

  const handleAddAppointment = async () => {
    try {
      await addAppointment(selectedDate, currentAppointment);
      fetchAppointments(selectedDate);
      setShowModal(false);
      setCurrentAppointment({ time: '', occupied: false });
    } catch (error) {
      console.error("Error adding appointment: ", error);
    }
  };

  const handleEditAppointment = async (id) => {
    try {
      await updateAppointment(id, currentAppointment);
      fetchAppointments(selectedDate);
      setShowModal(false);
      setCurrentAppointment({ time: '', occupied: false });
    } catch (error) {
      console.error("Error updating appointment: ", error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await deleteAppointment(id);
      fetchAppointments(selectedDate);
    } catch (error) {
      console.error("Error deleting appointment: ", error);
    }
  };

  const openModal = (appointment = { time: '', occupied: false }) => {
    setCurrentAppointment(appointment);
    setShowModal(true);
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
          <h2>Appointment Content_Admin</h2>
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.time}</td>
                  <td>{appointment.occupied ? 'Occupied' : 'Available'}</td>
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
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentAppointment.id ? 'Edit Appointment' : 'Add Appointment'}</Modal.Title>
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
            <Form.Group controlId="formOccupied" className="mt-3">
              <Form.Check
                type="checkbox"
                label="Occupied"
                checked={currentAppointment.occupied}
                onChange={(e) => setCurrentAppointment({ ...currentAppointment, occupied: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={currentAppointment.id ? () => handleEditAppointment(currentAppointment.id) : handleAddAppointment}>
            {currentAppointment.id ? 'Save Changes' : 'Add Appointment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Content_Admin;
