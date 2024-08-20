import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const AppointmentTable = ({ appointments, onEdit, onDelete, onConfirm, onUnconfirm }) => {
  return (
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
              <Button variant="warning" className="me-2" onClick={() => onEdit(appointment)}>
                <FaEdit />
              </Button>
              <Button variant="danger" className="me-2" onClick={() => onDelete(appointment)}>
                <FaTrash />
              </Button>
              {!appointment.confirmed && (
                <Button variant="success" onClick={() => onConfirm(appointment)}>
                  <FaCheck />
                </Button>
              )}
              {appointment.confirmed && (
                <Button variant="secondary" onClick={() => onUnconfirm(appointment)}>
                  <FaTimes /> Cancel
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AppointmentTable;
