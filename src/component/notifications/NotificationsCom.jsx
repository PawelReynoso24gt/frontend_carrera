import React, { useState } from "react";
import notifyImg from "../../assets/img/anotify1.svg";

function NotificationsCom() {
  const [notifications] = useState([
    {
      id: 1,
      title: "Notificación de prueba",
      message: "Este es un mensaje de prueba para la notificación.",
    },
  ]);

  return (
    <div className="row">
      <div className="col-12">
        <div className="crancy-body">
          <div className="crancy-dsinner">
            <div className="crancy-notifications crancy-notifications__all">
              <h4 className="crancy__notification__title mg-btm-20">
                Notificaciones
              </h4>
              <ul className="crancy-notification__list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li className="crancy-notification__item" key={notification.id}>
                      <div className="crancy-notification__content">
                        <div className="crancy-notification__icon">
                          <img src={notifyImg} alt="Notificación" />
                        </div>
                        <div className="crancy-notification__details">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                        </div>
                      </div>
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
