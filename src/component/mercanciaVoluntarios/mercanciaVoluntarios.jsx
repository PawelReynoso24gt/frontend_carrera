import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Spinner, Breadcrumb } from "react-bootstrap";
import "./mercancia.css";

function mercanciaVoluntariosComponent() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("nombreProducto");

  useEffect(() => {
    fetchProductosConDetalle();
  }, []);

  const fetchProductosConDetalle = async () => {
    try {
      const responseProductos = await axios.get("https://api.voluntariadoayuvi.com/productos");
      const responseDetalles = await axios.get("https://api.voluntariadoayuvi.com/detalle_stands");

      const productosCombinados = responseProductos.data.map((producto) => {
        const detalle = responseDetalles.data.find(
          (detalle) => detalle.idProducto === producto.idProducto
        );

        return {
          ...producto,
          idDetalleStands: detalle?.idDetalleStands || null,
          cantidad: detalle?.cantidad || 0,
          estadoDetalle: detalle?.estado || 0,
        };
      });

      setProductos(productosCombinados);
      setProductosFiltrados(productosCombinados);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products or details:", err);
      setError("Error al obtener productos o detalles del Stand Virtual.");
      setLoading(false);
    }
  };

  const updateStock = async (idDetalleStands, nuevaCantidad) => {
    if (!idDetalleStands || isNaN(nuevaCantidad)) {
      alert("El ID del detalle o el valor ingresado no es válido.");
      return;
    }

    try {
      await axios.put(`https://api.voluntariadoayuvi.com/detalle_stands/update/${idDetalleStands}`, {
        cantidad: nuevaCantidad,
      });
      alert("Stock actualizado con éxito.");
      fetchProductosConDetalle(); // Actualizar productos después del cambio
    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Error al actualizar el stock.");
    }
  };

  const handleBusqueda = (e) => {
    const valorBusqueda = e.target.value.toLowerCase();
    setBusqueda(valorBusqueda);

    const productosFiltrados = productos.filter((producto) => {
      if (filtro === "nombreProducto") {
        return producto.nombreProducto.toLowerCase().includes(valorBusqueda);
      } else if (filtro === "talla") {
        return producto.talla?.toLowerCase().includes(valorBusqueda);
      } else if (filtro === "categoria") {
        return producto.categoria?.nombreCategoria?.toLowerCase().includes(valorBusqueda);
      } else if (filtro === "stock") {
        return producto.cantidad.toString().includes(valorBusqueda);
      }
      return false;
    });

    setProductosFiltrados(productosFiltrados);
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setBusqueda("");
    setProductosFiltrados(productos);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spinner animation="border" variant="primary" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" style={{ marginTop: "20px", textAlign: "center" }}>
        {error}
      </Alert>
    );
  }

  return (

    <div className="container mt-4" style={{maxWidth: "100%", margin: "0 auto",}}>
      {/* Título y Breadcrumb */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
        .
        </h3>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Asignación de Stands</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Contenedor Principal */}
      <div
        style={{
          marginLeft: "350px",
          marginRight: "20px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
           maxWidth: "calc(100% - 270px)"
        }}
      >
       <div className="row" style={{ textAlign: "center", marginBottom: "20px" }}>
           <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            Asignación de stands
          </h3>
        </div>
        </div>
      {/* Buscador con filtro */}
      <div
        className="search-container"
        style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}
      >
        <select
          className="filter-dropdown"
          value={filtro}
          onChange={handleFiltroChange}
        >
          <option value="nombreProducto">Nombre</option>
          <option value="talla">Talla</option>
          <option value="categoria">Categoría</option>
          <option value="stock">Stock</option>
        </select>
        <input
          type="text"
          placeholder={`Buscar por ${filtro === "nombreProducto" ? "nombre" : filtro}`}
          value={busqueda}
          onChange={handleBusqueda}
        />
      </div>
      <div className="product-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <div key={producto.idProducto} className="product-card">
              <h5 className="product-title">{producto.nombreProducto}</h5>
              <p><b>Descripción:</b> {producto.descripcion}</p>
              <p><b>Talla:</b> {producto.talla}</p>
              <p><b>Precio:</b> Q{parseFloat(producto.precio).toFixed(2)}</p>
              <p><b>Cantidad Mínima:</b> {producto.cantidadMinima}</p>
              <p><b>Cantidad Máxima:</b> {producto.cantidadMaxima}</p>
              <p>
                <b>Stock:</b>
                <input
                  type="number"
                  defaultValue={producto.cantidad}
                  min="0"
                  onBlur={(e) =>
                    updateStock(producto.idDetalleStands, parseInt(e.target.value, 10))
                  }
                  className="stock-input"
                />
              </p>
              <p><b>Categoría:</b> {producto.categoria?.nombreCategoria || "Sin Categoría"}</p>
              <button
                className={`estado-button ${
                  producto.estadoDetalle === 1 ? "estado-activo" : "estado-inactivo"
                }`}
              >
                {producto.estadoDetalle === 1 ? "Activo" : "Inactivo"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center">No se encontraron productos.</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default mercanciaVoluntariosComponent;
