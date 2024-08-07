import { db } from "./Service";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

// Obtener turnos de un día específico
export const getAppointmentsByDate = async (date) => {
  try {
    const userCollectionRef = collection(db, 'workinDays');
    const q = query(userCollectionRef, where("date", "==", date.toLocaleDateString()));
    const querySnapshot = await getDocs(q);

    const fetchedAppointments = [];
    querySnapshot.forEach((doc) => {
      fetchedAppointments.push({ id: doc.id, ...doc.data() });
    });

    return fetchedAppointments;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    throw error;
  }
};

// Agregar un turno a un día específico
export const addAppointment = async (date, appointment) => {
    const appointments = await getAppointmentsByDate(date);
    console.log(appointments);
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

// Eliminar un turno
export const deleteAppointment = async (id) => {
  try {
    await deleteDoc(doc(db, 'workinDays', id));
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

// Editar un turno
export const updateAppointment = async (id, updatedAppointment) => {
  try {
    const appointmentDoc = doc(db, 'workinDays', id);
    await updateDoc(appointmentDoc, updatedAppointment);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Agregar múltiples turnos a un día específico
export const addMultipleAppointments = async (date, appointments) => {
  const batch = db.batch();
  try {
    appointments.forEach((appointment) => {
      const docRef = doc(collection(db, 'workinDays'));
      batch.set(docRef, {
        date: date.toLocaleDateString(),
        ...appointment
      });
    });
    await batch.commit();
  } catch (error) {
    console.error("Error adding multiple documents: ", error);
    throw error;
  }
};