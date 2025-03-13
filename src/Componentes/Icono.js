import React from 'react';
import { FaUser, FaIdCard, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Icono = ({ icono, color }) => {
  const IconComponent = icono; // El componente del icono
  return <IconComponent color={color} size={24} />;
};

export default Icono;