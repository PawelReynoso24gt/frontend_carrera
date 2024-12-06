import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../menu";
import Header from "../header";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

function Layout({ children }) {
  const [menu, setMenu] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal
  const [message, setMessage] = useState(""); // Mensaje a mostrar en el modal

  const toggleMenu = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    if (menu) {
      document
        .getElementsByClassName("crancy-adashboard")[0]
        .classList.add("crancy-close");
    } else {
      document
        .getElementsByClassName("crancy-adashboard")[0]
        .classList.remove("crancy-close");
    }
  }, [menu]);

  // Verificar si el usuario necesita cambiar su contraseña
  useEffect(() => {
    const checkPasswordChange = async () => {
      try {
        const response = await axios.get("http://localhost:5000/usuarios/verify", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye el token de autenticación
          },
        });

        const { changedPassword, message } = response.data;

        if (changedPassword === 0) {
          setMessage(message || "Necesitas cambiar tu contraseña.");
          setShowModal(true); // Muestra el modal si necesita cambiar la contraseña
        }
      } catch (error) {
        console.error("Error al verificar el estado de la contraseña:", error);
      }
    };

    checkPasswordChange();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
  };

  return (
    <div id="crancy-dark-light">
      <div className="crancy-body-area ">
        <Menu toggleMenu={toggleMenu} menu={menu} />
        <Header toggleMenu={toggleMenu} menu={menu} />
        <Outlet />
      </div>

      {/* Modal de Advertencia */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>¡Advertencia!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Layout;
