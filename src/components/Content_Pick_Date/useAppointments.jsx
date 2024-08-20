import { useState, useEffect } from "react";
import { db } from "../../Services/Service";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

const useAppointments = (selectedDate) => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async (date) => {
    if (!date) return;

    try {
      const userCollectionRef = collection(db, 'workinDays');
      const q = query(userCollectionRef, where("date", "==", date.toLocaleDateString()));
      const querySnapshot = await getDocs(q);

      const fetchedAppointments = [];
      querySnapshot.forEach((doc) => {
        fetchedAppointments.push({ id: doc.id, ...doc.data() });
      });

      setAppointments(fetchedAppointments);
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  };

  const updateAppointment = async (appointmentId, updatedShifts) => {
    const docRef = doc(db, 'workinDays', appointmentId);
    await updateDoc(docRef, { shifts: updatedShifts });
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate]);

  return { appointments, fetchAppointments, updateAppointment };
};

export default useAppointments;
