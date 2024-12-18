import React, { useState } from "react";
import logo from "../../assets/img/LogoAYUVIicon.png"; 
import fondo from "../../assets/img/wellington.jpeg"; 

function HomePage() {
  const [isHovered, setIsHovered] = useState(false); 
  const styles = {
    container: {
      background: `linear-gradient(135deg, rgb(49, 162, 228), rgb(238, 236, 125), rgb(191, 71, 228))`,
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
    logo: {
      width: "150px",
      marginBottom: "30px",
    },
    title: {
      fontSize: "48px",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "2px",
    },
    subtitle: {
      fontSize: "24px",
      fontWeight: "normal",
      marginTop: "10px",
      color: "black",
    },
    imageContainer: {
      marginTop: "40px",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    image: {
      width: "100%",
      maxWidth: "600px",
    },
    button: {
      marginTop: "30px",
      backgroundColor: isHovered ? "#FFB800" : "#FFD700",
      color: "#007AC3",
      padding: "10px 20px",
      fontSize: "18px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      {/* Logo Principal */}
      <img src={logo} alt="AYUVI Logo" style={styles.logo} />

      {/* Título y subtítulo */}
      <h1 style={styles.title}>Bienvenidos a AYUVI</h1>
      <p style={styles.subtitle}>
      Gracias por brindar esperanza de vida
      </p>
      <p style={styles.subtitle}>
      Juntos somos invencibles
      </p>

      {/* Imagen de fondo representativa */}
      <div style={styles.imageContainer}>
        <img src={fondo} alt="AYUVI Fondo" style={styles.image} />
      </div>


    </div>
  );
}

export default HomePage;
