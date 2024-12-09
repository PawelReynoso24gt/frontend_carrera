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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleIconClick}
        style={{ cursor: "pointer" }}
      >
        <path d="M16.7601 8.7232L16.0149 8.80778L16.7601 8.7232ZM17.2446 12.9916L17.9898 12.907L17.2446 12.9916ZM2.7567 12.9916L2.01149 12.907L2.7567 12.9916ZM3.24115 8.7232L3.98637 8.80778L3.24115 8.7232ZM1.81909 15.1115L1.24798 14.6254H1.24798L1.81909 15.1115ZM18.1822 15.1115L17.6111 15.5977V15.5977L18.1822 15.1115ZM12.4598 3.73821H11.7098C11.7098 4.0588 11.9135 4.34393 12.2168 4.44778L12.4598 3.73821ZM7.54154 3.73821L7.78449 4.44778C8.08778 4.34393 8.29154 4.0588 8.29154 3.73821H7.54154ZM13.953 20.93C14.0983 20.5421 13.9017 20.1098 13.5139 19.9644C13.126 19.8191 12.6937 20.0157 12.5484 20.4035L13.953 20.93ZM7.45295 20.4035C7.30759 20.0157 6.87532 19.8191 6.48745 19.9644C6.09958 20.1098 5.90299 20.5421 6.04835 20.93L7.45295 20.4035ZM16.2593 17.7501H3.74203V19.2501H16.2593V17.7501ZM16.0149 8.80778L16.4994 13.0762L17.9898 12.907L17.5054 8.63862L16.0149 8.80778ZM3.50192 13.0762L3.98637 8.80778L2.49594 8.63862L2.01149 12.907L3.50192 13.0762ZM2.39019 15.5977C3.00798 14.8719 3.39699 14.0006 3.50192 13.0762L2.01149 12.907C1.9419 13.5201 1.68245 14.115 1.24798 14.6254L2.39019 15.5977ZM16.4994 13.0762C16.6043 14.0006 16.9933 14.8719 17.6111 15.5977L18.7533 14.6254C18.3189 14.115 18.0594 13.5201 17.9898 12.907L16.4994 13.0762ZM3.74203 17.7501C3.01081 17.7501 2.48763 17.3878 2.2444 16.9592C2.00857 16.5436 2.01273 16.0411 2.39019 15.5977L1.24798 14.6254C0.436997 15.5781 0.412252 16.7699 0.939825 17.6995C1.46 18.6162 2.49251 19.2501 3.74203 19.2501V17.7501ZM16.2593 19.2501C17.5088 19.2501 18.5413 18.6162 19.0615 17.6995C19.5891 16.7699 19.5643 15.5781 18.7533 14.6254L17.6111 15.5977C17.9886 16.0411 17.9927 16.5436 17.7569 16.9592C17.5137 17.3878 16.9905 17.7501 16.2593 17.7501V19.2501Z" />
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
