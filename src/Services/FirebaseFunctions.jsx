import { db } from './Service';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';

// Obtener citas por fecha
export const getAppointmentsByDate = async (date) => {
    const appointmentsRef = collection(db, 'workinDays');
    const q = query(appointmentsRef, where('date', '==', date.toLocaleDateString()));
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    console.log(appointments)
    return appointments.length > 0 ? appointments[0] : null;
  };

// Agregar cita
export const addAppointment = async (date, appointment) => {
  const appointments = await getAppointmentsByDate(date);
  if (appointments) {
    const docRef = doc(db, 'workinDays', appointments.id);
    await updateDoc(docRef, {
      shifts: arrayUnion(appointment)
    });
  } else {
    const newDocRef = doc(collection(db, 'workinDays'));
    await setDoc(newDocRef, {
      date: date.toLocaleDateString(),
      shifts: [appointment]
    });
  }
};

// Eliminar cita
export const deleteAppointment = async (date, appointment) => {
  const appointments = await getAppointmentsByDate(date);
  if (appointments) {
    const docRef = doc(db, 'workinDays', appointments.id);
    await updateDoc(docRef, {
      shifts: arrayRemove(appointment)
    });
  }
};

// Actualizar cita
export const updateAppointment = async (date, oldAppointment, newAppointment) => {
  await deleteAppointment(date, oldAppointment);
  await addAppointment(date, newAppointment);
};


export const confirmAppointment = async (date, appointment) => {
    const appointmentData = await getAppointmentsByDate(date);
    if (appointmentData) {
      const updatedShifts = appointmentData.shifts.map((shift) =>
        shift.time === appointment.time ? { ...shift, confirmed: true } : shift
      );
      const docRef = doc(db, 'workinDays', appointmentData.id);
      await updateDoc(docRef, {
        shifts: updatedShifts
      });
    }
  };
