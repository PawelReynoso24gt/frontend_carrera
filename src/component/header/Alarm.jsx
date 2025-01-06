import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Alarm() {
  const navigate = useNavigate();
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const personId = localStorage.getItem("personId");

      if (!personId) {
        console.error("personId no encontrado en el localStorage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/notificaciones?idPersona=${personId}`
        );

        // Verificar si hay notificaciones y actualizar el estado
        if (response.data.length > 0) {
          setHasNotifications(true);
          // Guardar notificaciones en localStorage para `NotificationsCom`
          localStorage.setItem("notifications", JSON.stringify(response.data));
        } else {
          setHasNotifications(false);
        }
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleIconClick = () => {
    navigate("/notifications"); // Redirigir al componente de notificaciones
  };

  return (
    <div className="crancy-header__alarm" style={{ position: "relative" }}>
      {/* Ícono de la campana */}
      <svg
        className="crancy-header__svg--icon"
        width="40"
        height="40"
        viewBox="0 -3 10 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleIconClick}
        style={{ cursor: "pointer" }}
      >
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
      </svg>

      {/* Punto rojo si hay notificaciones */}
      {hasNotifications && (
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "red",
            borderRadius: "50%",
            width: "10px",
            height: "10px",
          }}
        ></span>
      )}
    </div>
  );
}

export default Alarm;
