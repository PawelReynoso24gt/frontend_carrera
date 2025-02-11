import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/img/LogoAYUVIicon.png"; 
import fondo from "../../assets/img/wellington.jpeg"; 
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Iconos de flechas
import { format, parseISO } from "date-fns"; // formato de fechas

function HomePage() {
  const [isHovered, setIsHovered] = useState(false); 
  const [fotosPublicaciones, setFotosPublicaciones] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // Estado para la foto activa

  // Componentes personalizados para los botones
  // Botón Anterior Personalizado
  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        right: "1025px", // Posición hacia la izquierda
        top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(255, 255, 255, 0.35)", // Fondo semi-transparente
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "10px",
        width: "50px", // Ancho del botón
        height: "200px", // Altura del botón
        cursor: "pointer",
        zIndex: 10,
        fontSize: "40px", // Tamaño del ícono
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.3s ease, transform 0.3s ease", // Animación para el hover
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "rgb(255, 238, 0)"; // Cambia el fondo al hacer hover
        e.target.style.transform = "translateY(-50%) scale(1.1)"; // Aumenta ligeramente el tamaño
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "rgba(255, 255, 255, 0.35)"; // Regresa al color original
        e.target.style.transform = "translateY(-50%) scale(1)"; // Regresa al tamaño original
      }}
    >
      <FaChevronLeft /> {/* Ícono de flecha izquierda */}
    </button>
  );

  // Botón Siguiente Personalizado
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: "1025px", // Posición hacia la derecha
        top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(255, 255, 255, 0.35)", // Fondo semi-transparente
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "10px",
        width: "50px", // Ancho del botón
        height: "200px", // Altura del botón
        cursor: "pointer",
        zIndex: 10,
        fontSize: "40px", // Tamaño del ícono
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.3s ease, transform 0.3s ease", // Animación para el hover
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "rgb(255, 238, 0)"; // Cambia el fondo al hacer hover
        e.target.style.transform = "translateY(-50%) scale(1.1)"; // Aumenta ligeramente el tamaño
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "rgba(255, 255, 255, 0.35)"; // Regresa al color original
        e.target.style.transform = "translateY(-50%) scale(1)"; // Regresa al tamaño original
      }}
    >
      <FaChevronRight /> {/* Ícono de flecha derecha */}
    </button>
  );

  // Fetch fotos desde la API
  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await axios.get("https://api.voluntariadoayuvi.com/publicaciones/completas");
        const fotosPublicaciones = response.data.flatMap((publicacion) => {
          // Aquí el array está correctamente definido dentro del contexto
          return [
            ...publicacion.publicacionesGenerales.map((foto) => ({
              foto: foto.foto,
              nombrePublicacion: publicacion.nombrePublicacion,
              fechaPublicacion: publicacion.fechaPublicacion,
              descripcion: publicacion.descripcion,
            })),
            ...publicacion.publicacionesEventos.map((foto) => ({
              foto: foto.foto,
              nombrePublicacion: publicacion.nombrePublicacion,
              fechaPublicacion: publicacion.fechaPublicacion,
              descripcion: publicacion.descripcion,
            })),
            ...publicacion.publicacionesRifas.map((foto) => ({
              foto: foto.foto,
              nombrePublicacion: publicacion.nombrePublicacion,
              fechaPublicacion: publicacion.fechaPublicacion,
              descripcion: publicacion.descripcion,
            })),
          ];
        });
        setFotosPublicaciones(fotosPublicaciones); // Aquí se asigna correctamente
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
  
    fetchFotos();
  }, []);    

  const styles = {
    container: {
      //background: `linear-gradient(135deg, rgb(49, 162, 228), rgb(238, 236, 125), rgb(191, 71, 228))`,
      background: "rgb(0, 208, 255)", // celeste
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px",
      fontFamily: "'Arial', sans-serif",
    },
    header: {
      position: "absolute",
      top: "50px",
      left: "50%",
      transform: "translateX(-50%)",
      textAlign: "center",
      zIndex: 10,
    },
    logo: {
      width: "150px",
      marginBottom: "30px",
    },
    title: {
      fontSize: "48px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "2px",
      color: "#000000",
    },
    subtitle: {
      fontSize: "24px",
      fontWeight: "normal",
      marginTop: "10px",
      color: "black",
    },
    infoBox: {
      background: "rgb(20, 70, 140)",
      padding: "20px",
      borderRadius: "10px",
      marginTop: "500px",
      marginBottom: "20px",
      textAlign: "center",
      width: "80%",
      maxWidth: "1000px",
      height: "auto", // Altura inicial ajustable
      maxHeight: "300px", // Altura máxima permitida
      overflowY: "auto", // Desplazamiento vertical si el contenido supera el máximo
      wordWrap: "break-word", // Rompe palabras largas para mantener el ancho
    },
    infoTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
      // color: "#000000", // negro
      color: "#ffffff", // blanco
    },
    infoDescription: {
      fontSize: "16px",
      marginBottom: "10px",
      // color: "#000000", // negro
      color: "#ffffff", // blanco
    },
    infoDate: {
      fontSize: "16px",
      fontStyle: "italic",
      // color: "#000000", // negro
      color: "#ffffff", // blanco
    },
    carouselContainer: {
      marginBottom: "100px",
      width: "80%",
      maxWidth: "1000px",
      position: "relative", // Importante para posicionar los botones dentro del contenedor
    },
    image: {
      width: "100%", // El ancho del contenedor
      height: "500px", // Altura fija del contenedor
      objectFit: "contain", // Ajusta la imagen dentro del contenedor manteniendo su proporción
      objectPosition: "center", // Centra la imagen dentro del contenedor
      borderRadius: "10px", // Bordes redondeados
      backgroundColor: "rgb(8, 171, 215)", // Fondo para relleno en caso de que la imagen no ocupe todo el espacio
    },    
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <PrevArrow />, // Botón anterior personalizado
    nextArrow: <NextArrow />, // Botón siguiente personalizado
    beforeChange: (oldIndex, newIndex) => setActiveIndex(newIndex), // Actualiza el índice activo
  };

  return (
    <div style={styles.container}>
      {/* Header con Logo y Texto */}
      <div style={styles.header}>
        <img src={logo} alt="AYUVI Logo" style={styles.logo} />
        <h1 style={styles.title}>Bienvenidos a AYUVI</h1>
        <p style={styles.subtitle}>Gracias por brindar esperanza de vida</p>
        <p style={styles.subtitle}>Juntos somos invencibles</p>
      </div>

      {/* Cuadro de Información */}
      {fotosPublicaciones.length > 0 && (
        <div style={styles.infoBox}>
          <p style={styles.infoTitle}>{fotosPublicaciones[activeIndex].nombrePublicacion}</p>
          <p style={styles.infoDescription}>{fotosPublicaciones[activeIndex].descripcion}</p>
          <p style={styles.infoDate}>
            Publicado el día: {fotosPublicaciones[activeIndex].fechaPublicacion
              ? format(parseISO(fotosPublicaciones[activeIndex].fechaPublicacion), "dd-MM-yyyy hh:mm a")
              : "Sin fecha"}
          </p>
        </div>
      )}

      {/* Carrusel */}
      <div style={styles.carouselContainer}>
        <SlickSlider {...sliderSettings}>
          {fotosPublicaciones.map((publicacion, index) => (
            <div key={index}>
              <img
                src={`https://api.voluntariadoayuvi.com/${publicacion.foto}`}
                alt={`Slide ${index + 1}`}
                style={styles.image}
              />
            </div>
          ))}
        </SlickSlider>
      </div>
    </div>
  );
}

export default HomePage;
