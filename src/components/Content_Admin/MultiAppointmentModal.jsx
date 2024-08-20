import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';


const MultiAppointmentModal = ({ show, onClose, onSave }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    const start = parseInt(startTime, 10);
    const end = parseInt(endTime, 10);

    if (start >= end || end > 21) {
      Swal.fire("Invalid time range.")
      return;
    }

    onSave(start, end);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Multiple Appointments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStartTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="21"
              placeholder="Enter start time (e.g., 8 for 08:00)"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEndTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="21"
              placeholder="Enter end time (e.g., 16 for 16:00)"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Appointments
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MultiAppointmentModal;
