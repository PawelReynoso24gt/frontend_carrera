import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, InputGroup, FormControl } from "react-bootstrap";
import { format } from "date-fns";
import { parseISO } from "date-fns";

function Bitacoras() {
  const [bitacoras, setBitacoras] = useState([]);
  const [filteredBitacoras, setFilteredBitacoras] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchBitacoras();
  }, []);

  const fetchBitacoras = async () => {
    try {
      const response = await axios.get("https://api.voluntariadoayuvi.com/bitacora");
      setBitacoras(response.data);
      setFilteredBitacoras(response.data);
    } catch (error) {
      console.error("Error fetching bitácoras:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = bitacoras.filter((bitacora) =>
      bitacora.descripcion.toLowerCase().includes(value) ||
      bitacora.usuario?.persona.nombre.toLowerCase().includes(value) ||
      bitacora.categoria_bitacora.categoria.toLowerCase().includes(value)
    );

    setFilteredBitacoras(filtered);
    setCurrentPage(1); // Reiniciar a la primera página tras la búsqueda
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentBitacoras = filteredBitacoras.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredBitacoras.length / rowsPerPage);

  const renderPagination = () => (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) setCurrentPage((prev) => prev - 1);
        }}
        style={{
          color: currentPage === 1 ? "gray" : "#007AC3",
          cursor: currentPage === 1 ? "default" : "pointer",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Anterior
      </a>

      <div className="d-flex align-items-center">
        <span style={{ marginRight: "10px", fontWeight: "bold" }}>Filas</span>
        <FormControl
          as="select"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            width: "100px",
            height: "40px",
          }}
        >
          {[5, 10, 20, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </FormControl>
      </div>

      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
        }}
        style={{
          color: currentPage === totalPages ? "gray" : "#007AC3",
          cursor: currentPage === totalPages ? "default" : "pointer",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Siguiente
      </a>
    </div>
  );

  return (
    <>
 <div className="row justify-content-center" style={{marginBottom: "20px" }}>
        <div className="col-12 text-center">
          <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
            Bitácoras
          </h3>
        </div>
      </div>


      <div
        className="container mt-4"
        style={{
          maxWidth: "100%", 
          margin: "0 auto",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar bitácora por descripción, usuario o categoría..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </InputGroup>

        <Table
          striped
          bordered
          hover
          responsive
          className="mt-3"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <thead style={{ backgroundColor: "#007AC3", color: "#fff", textAlign: "center" }}>
            <tr>
              <th>ID</th>
              <th>Fecha y Hora</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Usuario</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody style={{ textAlign: "center" }}>
            {currentBitacoras.map((bitacora) => (
              <tr key={bitacora.idBitacora}>
                <td>{bitacora.idBitacora}</td>
                <td>{bitacora.fechaHora ? format(parseISO(bitacora.fechaHora), "dd-MM-yyyy hh:mm a") : "Sin fecha"}</td>
                <td>{bitacora.descripcion}</td>
                <td>{bitacora.estado}</td>
                <td>{bitacora.usuario ? bitacora.usuario.persona.nombre : "Sistema"}</td>
                <td>{bitacora.categoria_bitacora.categoria}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {renderPagination()}
      </div>
    </>
  );
}

export default Bitacoras;