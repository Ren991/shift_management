import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "react-day-picker/style.css";

const MySwal = withReactContent(Swal);

function Content_Pick_Date() {
  const [selected, setSelected] = useState();
  const array = [
    {
      time: "14:00",
      ocupped: true
    },
    {
      time: "15:00",
      ocupped: false
    },
    {
      time: "16:00",
      ocupped: false
    }
  ];

  const handleClockClick = (time) => {
    MySwal.fire(`Clicked on clock for ${time}`);
  };

  const showAppointmentsModal = () => {
    MySwal.fire({
      title: 'Choose your Shift',
      html: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {array.map((appointment, index) => (
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
              {!appointment.ocupped && (
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

  if (selected) {
    console.log(selected.toLocaleDateString());
    showAppointmentsModal();
  } else {
    console.log(selected);
  }

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={
        selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
      }
    />
  );
}

export default Content_Pick_Date;
