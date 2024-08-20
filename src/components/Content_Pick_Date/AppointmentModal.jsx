import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaClock } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const AppointmentModal = ({ appointments, handleClockClick }) => {
  if (!appointments || appointments.length === 0 || !appointments[0].shifts) {
    MySwal.fire({
      icon: "error",
      title: "There are no turns",
      text: "There are no appointments available for the selected date.",
    });
    return null;
  }

  // Ordenar los turnos por hora
  const sortedShifts = appointments[0].shifts.sort((a, b) => {    
    const timeA = parseInt(a.time.replace(':', ''), 10);
    const timeB = parseInt(b.time.replace(':', ''), 10);
    return timeA - timeB;
  });

  MySwal.fire({
    title: 'Shifts',
    html: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sortedShifts.map((appointment, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <span>{appointment.time}</span>
            {!appointment.occupied && (
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2em',
                }}
                onClick={() => handleClockClick(appointment.time)}
              >
                <FaClock />
              </button>
            )}
          </div>
        ))}
      </div>
    ),
    showConfirmButton: false,
    showCloseButton: true,
  });
};

export default AppointmentModal;
