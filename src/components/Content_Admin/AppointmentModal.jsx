import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AppointmentModal = ({ show, onClose, onSave, currentAppointment, setCurrentAppointment, editing }) => {
  return (
    <Modal show={show} onHide={onClose}>
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
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          {editing ? 'Save Changes' : 'Add Appointment'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentModal;
