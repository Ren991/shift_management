import { useState, useEffect } from 'react';
import { getAppointmentsByDate, addAppointment, deleteAppointment, confirmAppointment, unconfirmAppointment } from '../../Services/FirebaseFunctions';

const useAppointments = (selectedDate) => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async (date) => {
    const fetchedAppointments = await getAppointmentsByDate(date);
    setAppointments(fetchedAppointments ? fetchedAppointments.shifts : []);
  };

  const handleAddAppointment = async (appointment) => {
    try {
      await addAppointment(selectedDate, appointment);
      fetchAppointments(selectedDate);
    } catch (error) {
      console.error("Error adding appointment: ", error);
    }
  };

  const handleDeleteAppointment = async (appointment) => {
    try {
      await deleteAppointment(selectedDate, appointment);
      fetchAppointments(selectedDate);
    } catch (error) {
      console.error("Error deleting appointment: ", error);
    }
  };

  const handleConfirmAppointment = async (appointment) => {
    try {
      await confirmAppointment(selectedDate, appointment);
      fetchAppointments(selectedDate);
    } catch (error) {
      console.error("Error confirming appointment: ", error);
    }
  };

  const handleUnconfirmAppointment = async (appointment) => {
    try {
      await unconfirmAppointment(selectedDate, appointment);
      fetchAppointments(selectedDate);
    } catch (error) {
      console.error("Error unconfirming appointment: ", error);
    }
  };

  const handleAddMultipleAppointments = async (start, end) => {
    try {
      for (let hour = start; hour <= end; hour++) {
        const newAppointment = {
          time: `${hour}:00`,
          occupied: false,
          confirmed: false,
        };
        await handleAddAppointment(newAppointment);
      }
      fetchAppointments(selectedDate);
    } catch (error) {
      console.error("Error adding multiple appointments: ", error);
    }
  };


  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate]);

  return {
    appointments,
    fetchAppointments,
    handleAddAppointment,
    handleDeleteAppointment,
    handleConfirmAppointment,
    handleUnconfirmAppointment,
    handleAddMultipleAppointments
  };
};

export default useAppointments;
