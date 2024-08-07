import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Container, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
//import { getAppointmentsByDate, addAppointment, deleteAppointment, updateAppointment } from "../../Services/firebaseFunctions";
import { getAppointmentsByDate, addAppointment, deleteAppointment, updateAppointment } from '../../Services/FirebaseFunctions';

const Content_Admin = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState({ time: '', occupied: false, name: '', mail: '' });
    const [editing, setEditing] = useState(false);
    const [oldAppointment, setOldAppointment] = useState(null);
  
    const fetchAppointments = async (date) => {
      const fetchedAppointments = await getAppointmentsByDate(date);
      console.log(fetchedAppointments);
      setAppointments(fetchedAppointments ? fetchedAppointments[0].shifts : []);
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
  
    const handleEditAppointment = async () => {
      try {
        await updateAppointment(selectedDate, oldAppointment, currentAppointment);
        fetchAppointments(selectedDate);
        handleCloseModal();
      } catch (error) {
        console.error("Error updating appointment: ", error);
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
  
    const handleCloseModal = () => {
      setShowModal(false);
      setCurrentAppointment({ time: '', occupied: false, name: '', mail: '' });
      setEditing(false);
      setOldAppointment(null);
    };
  
    const openModal = (appointment = { time: '', occupied: false, name: '', mail: '' }) => {
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments && appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.time}</td>
                    <td>{appointment.name}</td>
                    <td>{appointment.mail}</td>
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
                        onClick={() => handleDeleteAppointment(appointment)}
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
              <Form.Group controlId="formName" className="mt-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={currentAppointment.name}
                  onChange={(e) => setCurrentAppointment({ ...currentAppointment, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formMail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={currentAppointment.mail}
                  onChange={(e) => setCurrentAppointment({ ...currentAppointment, mail: e.target.value })}
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
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={editing ? handleEditAppointment : handleAddAppointment}>
              {editing ? 'Save Changes' : 'Add Appointment'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };
  

export default Content_Admin;
