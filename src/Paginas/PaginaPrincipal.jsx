import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import product1 from "../Componentes/Imagenes/Image2.png";
import product2 from "../Componentes/Imagenes/Imagen1.png";
import product3 from "../Componentes/Imagenes/wavy_background_4.jpg";
import imageForBlackBackground1 from "../Componentes/Imagenes/fht6.jpg";
import imageForBlackBackground2 from "../Componentes/Imagenes/347317299795.jpg";
import imageForBlackBackground3 from "../Componentes/Imagenes/SL_0210121_40570_75.jpg";
import imageForBlackBackground4 from "../Componentes/Imagenes/wavy_background_4.jpg";
import Breadcrumbs from '../Componentes/Navegacion/BreadcrumbsProductos';

const Home = () => {
  const sections = [
    {
      id: 1,
      title: 'Centro de Rehabilitación Integral San Juan',
      description: 'En nuestro centro, nos dedicamos a mejorar tu bienestar físico y mental a través de tratamientos personalizados. Ofrecemos masajes terapéuticos, fisioterapia especializada y programas de rehabilitación diseñados para ayudarte a recuperar tu salud y calidad de vida de manera integral.',
      backgroundImage: product1,
    },
    {
      id: 2,
      title: 'Misión',
      description: 'Nuestra misión es proporcionar atención de calidad y programas de rehabilitación adaptados a las necesidades de cada paciente, promoviendo su bienestar integral.',
      backgroundImage: imageForBlackBackground1,
    },
    {
      id: 3,
      title: 'Visión',
      description: 'Ser el centro de rehabilitación líder, reconocido por su compromiso con la salud y el bienestar, utilizando técnicas innovadoras para la recuperación de nuestros pacientes.',
      backgroundImage: imageForBlackBackground3,
    },
    {
      id: 4,
      title: 'Productos de Limpieza Facial',
      description: 'Contamos con productos de alta calidad diseñados para purificar y cuidar la piel del rostro, ayudando a mantener un cutis saludable y libre de impurezas.',
      backgroundImage: imageForBlackBackground2,
    },
    {
      id: 5,
      title: 'Servicios de Rehabilitación',
      description: 'Ofrecemos una amplia gama de servicios, como fisioterapia, masajes terapéuticos y programas personalizados, para mejorar tu calidad de vida y bienestar.',
      backgroundImage: imageForBlackBackground3,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [titleText, setTitleText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Dirección hacia la derecha
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sections.length);
    }, 8000); // Permanencia de cada imagen (8 segundos)

    return () => clearInterval(interval);
  }, [sections.length]);

  useEffect(() => {
    const section = sections[currentIndex];
    let index = 0;
    setTitleText('');
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      setTitleText((prev) => prev + section.title[index]);
      index++;

      if (index === section.title.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 100); // Velocidad de escritura (130ms por letra)

    return () => clearInterval(typingInterval);
  }, [currentIndex]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 1,
    }),
  };

  return (
    <div>
      {/* Contenedor del carrusel */}
      <div style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        margin: 0,
        padding: 0,
      }}>
        <Breadcrumbs />
        <AnimatePresence custom={direction}>
          {sections.map((section, index) => (
            index === currentIndex && (
              <motion.div
                key={section.id}
                custom={direction}  
                initial="enter"
                animate="center"
                exit="exit"
                variants={variants}
                transition={{ duration: 1, ease: 'easeInOut' }} // Transición rápida
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                  color: '#fff',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  zIndex: 1,
                  margin: 0,
                  padding: 0,
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 2,
                }}></div>
                <div style={{
                  zIndex: 3,
                  position: 'relative',
                  textAlign: 'center',
                  maxWidth: '800px',
                  padding: '10px',
                  width: '90%',
                  wordWrap: 'break-word', // Asegura que el texto largo se divida en varias líneas
                  lineHeight: '1.5',
                }}>
                  <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    wordWrap: 'break-word', // Asegura que el título también se divida
                    whiteSpace: 'normal', // Permite el ajuste de línea en títulos largos
                  }}>
                    {titleText}
                  </h1>
                  <p style={{
                    fontSize: '1rem',
                    whiteSpace: 'normal', // Permite que el texto se ajuste
                  }}>
                    {section.description}
                  </p>
                </div>
                <img
                  src={section.backgroundImage}
                  alt={`Slide ${section.id}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                  }}
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Nueva sección debajo del carrusel */}
      <div style={{
        width: '100%',
        minHeight: '100vh', // Asegura que ocupe al menos el alto de la pantalla
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5))',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '80%',
          maxWidth: '1200px',
          gap: '40px', // Espacio entre los recuadros
        }}>
          {/* Recuadro de horario de atención */}
          <div style={{
            background: 'hsla(0, 0.00%, 47.80%, 0.90)',
            padding: '20px',
            borderRadius: '15px',
            width: '50%',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#fff', textAlign: 'center' }}>Horario de Atención</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '15px',
            }}>
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                <div key={day} style={{
                  background: 'rgba(182, 249, 175, 0.9)',
                  padding: '15px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  textAlign: 'center',
                }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#555' }}>{day}</h3>
                  <p style={{ fontSize: '1rem', color: '#777' }}>8:00 AM - 6:00 PM</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recuadro del mapa */}
          <div style={{
            background: 'rgba(79, 81, 80, 0.9)',
            padding: '20px',
            borderRadius: '15px',
            width: '50%',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#fff', textAlign: 'center' }}>Centro de Rehabilitación Integral San Juan</h2>
            <div style={{ width: '100%', height: '400px', background: '#ccc', borderRadius: '10px', overflow: 'hidden' }}>
              {/* Aquí puedes integrar un mapa usando una API como Google Maps */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.3116289179378!2d-98.40923193041279!3d21.14258569878345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d726976bcbeec9%3A0x46764bc322c8c614!2sCiber%20Melas!5e0!3m2!1ses!2smx!4v1740551723799!5m2!1ses!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;