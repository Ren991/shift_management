import { useState,useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { FaClock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "react-day-picker/style.css";
import { getApp } from "firebase/app";
import { db } from "../../Services/Service";
import { collection, addDoc,doc,setDoc,getDocs } from "firebase/firestore";

const MySwal = withReactContent(Swal);

function Content_Pick_Date() {

    
  const [selected, setSelected] = useState();

  async function fetchDocuments() {
    try {
      const userCollectionRef = collection(db, 'workinDays');
      const querySnapshot = await getDocs(userCollectionRef);
      console.log(querySnapshot)
  
      if (querySnapshot.empty) {
        console.log("No documents found.");
        return;
      }
  
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
      });
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  }
  
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
    fetchDocuments();
    console.log("EL DIAA SELECCIONADO => " , selected.toLocaleDateString());

    MySwal.fire({
      title: 'Shifts',
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
                  /* onClick={() => handleClockClick(appointment.time)} */
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
      showAppointmentsModal();
    }
  }, [selected]);

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
