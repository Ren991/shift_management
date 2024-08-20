import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import useAppointments from "./useAppointments";
import AppointmentModal from "./AppointmentModal";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Content_Pick_Date() {
  const [selected, setSelected] = useState();
  const { appointments, updateAppointment } = useAppointments(selected);

  const handleClockClick = (time) => {
    MySwal.fire({
      title: `Appointment at ${time}`,
      html: `
        <input type="text" id="name" class="swal2-input" placeholder="Name">
        <input type="email" id="email" class="swal2-input" placeholder="Email">
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value;
        const email = Swal.getPopup().querySelector('#email').value;
        if (!name || !email) {
          Swal.showValidationMessage(`Please enter both name and email`);
        }
        return { name, email };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedShifts = appointments[0].shifts.map(shift => 
          shift.time === time ? { ...shift, name: result.value.name, mail: result.value.email, occupied: true } : shift
        );
        await updateAppointment(appointments[0].id, updatedShifts);

        MySwal.fire('Success', 'Your appointment has been booked!', 'success');
      }
    });
  };

  useEffect(() => {
    if (appointments.length > 0) {
      AppointmentModal({ appointments, handleClockClick });
    }
  }, [appointments]);

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
