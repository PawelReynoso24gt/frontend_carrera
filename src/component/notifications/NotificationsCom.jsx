import React, { useEffect, useState } from "react";
import axios from "axios";
import notifyImg from "../../assets/img/anotify2.svg";
import { getUserDataFromToken } from "../../utils/jwtUtils"; // token

function NotificationsCom() {
  const [notifications, setNotifications] = useState([]);

  // Función para obtener notificaciones del backend
  const fetchNotifications = async () => {
    const personId = getUserDataFromToken(localStorage.getItem("token"))?.idPersona;

    if (!personId) {
      console.error("personId no encontrado en el localStorage.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.voluntariadoayuvi.com/notificaciones?idPersona=${personId}`
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error al obtener las notificaciones:", error);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Llamada inicial para cargar las notificaciones
  }, []); // Este efecto solo se ejecutará una vez al montar el componente

  // Manejar el cambio de estado (marcar como revisada)
  const handleCheckNotification = async (idNotificacion) => {
    try {
      // Cambiar el estado de la notificación a 0 (marcar como revisada)
      await axios.put(`https://api.voluntariadoayuvi.com/notificaciones/${idNotificacion}`, {
        estado: 0, // Cambiar el estado a 0 (marcar como revisada)
      });

      // Actualizar localmente la notificación específica
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.idNotificacion === idNotificacion
            ? { ...notification, estado: 0 }
            : notification
        )
      );

      // Esperar 5 segundos antes de recargar las notificaciones
      setTimeout(async () => {
        console.log("Recargando las notificaciones...");
        await fetchNotifications(); // Recargar las notificaciones
      }, 5000);
    } catch (error) {
      console.error("Error al actualizar la notificación:", error);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="crancy-body">
          <div className="crancy-dsinner">
            <div className="crancy-notifications crancy-notifications__all">
              <ul className="crancy-notification__list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li
                      className="crancy-notification__item"
                      key={notification.idNotificacion}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                      }}
                    >
                      <div className="crancy-notification__content" style={{ display: "flex" }}>
                        <div className="crancy-notification__icon" style={{ marginRight: "15px" }}>
                          <img
                            src={notifyImg}
                            alt="Notificación"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              backgroundColor: "#f5f5f5",
                              padding: "5px",
                            }}
                          />
                        </div>
                        <div>
                          <h4 style={{ marginBottom: "5px", fontWeight: "bold" }}>
                            {notification.tipo_notificacione.tipoNotificacion}
                          </h4>
                          <p style={{ marginBottom: "5px", color: "#666" }}>
                            {notification.bitacora.descripcion}
                          </p>
                          <p style={{ fontSize: "12px", color: "#999" }}>
                            {new Date(notification.bitacora.fechaHora).toLocaleString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        id={`notification-${notification.idNotificacion}`}
                        name={`notification-${notification.idNotificacion}`}
                        checked={notification.estado === 0}
                        onChange={() => handleCheckNotification(notification.idNotificacion)}
                        style={{
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </li>
                  ))
                ) : (
                  <li className="crancy-notification__item">
                    <p>No hay notificaciones.</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsCom;