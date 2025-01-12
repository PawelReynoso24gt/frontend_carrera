import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

const Desarrolladores = () => {
  const developers = [
    {
      name: "Pawel Alessandro Reynoso Marquez",
      role: "Diseñador de base de datos, Desarrollador de backend y frontend (Product Owner)",
      description:
        "Nacido en Santa Cruz del Quiché, Quiché, Guatemala, el 24 de julio de 2002. Actualmente cuenta con pénsum cerrado de la carrera de Ingeniería en Sistemas, Informática y Ciencias de la Computación en la Universidad Mesoamericana, sede Quetzaltenango, en 2024. Además, obtuvo el título de Perito Contador con Especialidad en Computación en el Colegio Evangélico Metodista UTATLÁN de Santa Cruz del Quiché en 2020.",
      image: "src/assets/img/Pawel.jpeg",
      imageStyle: { maxHeight: "400px", width: "100%", objectFit: "contain" },
    },
    {
      name: "Angely Esmeralda Thomas Cortéz",
      role: "Diseñador UI, Desarrollador de backend y frontend  (SCRUM Master)",
      description:
        "Nacida en Quetzaltenango, Guatemala, el 10 de noviembre de 2004. Cuenta con pénsum cerrado de la carrera de Ingeniería en Sistemas, Informática y Ciencias de la Computación en la Universidad Mesoamericana, sede Quetzaltenango, en 2024. Además, obtuvo el título de Bachiller en Ciencias Exactas con orientación en Computación en el colegio IEA Los Altos de Quetzaltenango en 2020.",
      image: "/src/assets/img/Angely.jpeg",
      imageStyle: { maxHeight: "400px", width: "100%", objectFit: "contain" },
    },
    {
      name: "Pablo Daniel Vásquez Monzón",
      role: "Administrador de seguridad, Desarrollador de backend y frontend",
      description:
        "Nacido en San Marcos, Guatemala el 16 de Diciembre de 2003. Actualmente cuenta con pensum cerrado de la carrera de Ingeniería en Sistemas, Informática y Ciencias de la computación en la Universidad Mesoamericana, sede Quetzaltenango, en 2024. Además obtuvo el titulo de Bachiller en computación con orientación científica en el Colegio Pre Universitario Galileo en San Marcos 2020.",
      image: "/src/assets/img/Pablo.jpeg",
      imageStyle: { maxHeight: "400px", width: "100%", objectFit: "contain" },
    },
    {
      name: "Alejandra González Monterrosa",
      role: "Diseñador de base de datos, Desarrollador de backend y frontend",
      description:
        "Nacida en Retalhuleu, Guatemala el 27 de julio de 2003. Actualmente cuenta con pensum cerrado de la carrera de Ingeniería en Sistemas, Informática y Ciencias de la computación en la Universidad Mesoamericana, sede Quetzaltenango, en 2024. Además obtuvo el titulo de Bachiller en ciencias y letras con orientación en computación en el Colegio Mixto Dantoni en Retalhuleu 2020",
      image: "/src/assets/img/Alejandra.jpeg",
      imageStyle: { maxHeight: "400px", width: "100%", objectFit: "contain" },
    },
  ];

  return (
    <Container
      style={{
        marginTop: "20px",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#007AC3",
        }}
      >
        Equipo de Desarrolladores
      </h2>

       {/* Nuevo recuadro para el texto */}
       <div
        style={{
          backgroundColor: "#F9F7ED",
          color: "#ffffff",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0,  fontWeight: "bold", fontSize: "20px" }}>
        Este proyecto fue desarrollado por estudiantes de la Facultad de Ingeniería de la Universidad Mesoamericana, sede Quetzaltenango, 
        como parte de los requisitos del Proyecto de Carrera para la obtención del título de Ingeniería en Sistemas, Informática y Ciencias de la Computación. 
        Cada integrante del equipo contribuyó con sus conocimientos y habilidades técnicas, abarcando áreas como diseño de bases de datos,
        desarrollo backend y frontend, así como gestión de seguridad informática, demostrando un compromiso con la excelencia académica y profesional.
        </p>
      </div>

      
      <div
        style={{
          backgroundColor: "#F9F7ED",
          color: "#ffffff",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0,  fontWeight: "bold", fontSize: "20px" }}>
        Todas las imágenes utilizadas en este proyecto son propiedad exclusiva de AYUVI, y su uso está destinado únicamente para los fines específicos de este sistema. 
        Asimismo, al finalizar el proyecto, el código fuente y el programa completo serán entregados a AYUVI para su uso, permitiéndoles realizar las modificaciones y 
        adaptaciones necesarias según se requiera a futuro. El sistema será donado en su totalidad a la organización, bajo la condición de que su uso se limite exclusivamente a 
        AYUVI y sus operaciones. Además, se incluirá una sección en el sistema para reconocer a los desarrolladores que participaron en su creación, como parte del compromiso y 
        la transparencia del proyecto.
        </p>
      </div>


      <Row>
        {developers.map((developer, index) => (
          <Col key={index} md={6} lg={4} className="mb-4">
            <Card
              style={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Img
                variant="top"
                src={developer.image}
                alt={developer.name}
                style={{
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  ...developer.imageStyle, 
                }}
              />

              <Card.Body>
                <Card.Title style={{ color: "#007AC3", fontWeight: "bold" }}>
                  {developer.name}
                </Card.Title>
                <Card.Subtitle
                  style={{ marginBottom: "10px", color: "#009B85" }}
                >
                  {developer.role}
                </Card.Subtitle>
                <Card.Text style={{ color: "#555", textAlign: "justify"}}>
                  {developer.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Desarrolladores;
