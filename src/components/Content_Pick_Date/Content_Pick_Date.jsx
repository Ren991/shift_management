import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "react-day-picker/style.css";
import { db } from "../../Services/Service";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

const MySwal = withReactContent(Swal);

function Content_Pick_Date() {
  const [selected, setSelected] = useState();
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async (selectedDate) => {
    if (!selectedDate) return;
  
    try {
      const userCollectionRef = collection(db, 'workinDays');
      const q = query(userCollectionRef, where("date", "==", selectedDate.toLocaleDateString()));
      const querySnapshot = await getDocs(q);
  
      const fetchedAppointments = [];
      querySnapshot.forEach((doc) => {
        fetchedAppointments.push({ id: doc.id, ...doc.data() }); // Incluye el id del documento
      });
  
      setAppointments(fetchedAppointments);
      console.log("Appointments fetched: ", fetchedAppointments);
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  };

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
        return { name: name, email: email };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(`Name: ${result.value.name}, Email: ${result.value.email}`);
        
        // Buscar el turno en appointments y actualizarlo
        const updatedShifts = appointments[0].shifts.map(shift => 
          shift.time === time ? { ...shift, name: result.value.name, mail: result.value.email, occupied: true } : shift
        );
        console.log(appointments)
        
        // Obtener referencia del documento en Firebase
        const docRef = doc(db, 'workinDays', appointments[0].id);
        console.log(docRef);
        await updateDoc(docRef, {
          shifts: updatedShifts
        });
  
        MySwal.fire('Success', 'Your appointment has been booked!', 'success');
      }
    });
  };
  

  const showAppointmentsModal = () => {
    console.log("EL DIA SELECCIONADO => ", selected?.toLocaleDateString());

    if (appointments.length === 0 || !appointments[0].shifts || appointments[0].shifts.length === 0) {
      MySwal.fire({
        icon: "error",
        title: "There are no turns",
        text: "There are no appointments available for the selected date.",
      });
      return;
    }

    MySwal.fire({
      title: 'Shifts',
      html: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {appointments[0].shifts.map((appointment, index) => (
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

  useEffect(() => {
    if (selected) {
      fetchAppointments(selected);
    }
  }, [selected]);

  useEffect(() => {
    if (appointments.length > 0) {
      showAppointmentsModal();
    } else if (selected) {
        MySwal.fire({
            icon: "error",
            title: "No Appointments",
            text: "No appointments available for the selected date.",
          });
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
