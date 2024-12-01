import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert } from "react-bootstrap";
import "./mercancia.css";

function mercanciaVoluntariosComponent() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("nombreProducto"); // Por defecto buscará por nombre

  useEffect(() => {
    fetchProductosConDetalle();
  }, []);

  const fetchProductosConDetalle = async () => {
    try {
      // Obtener productos
      const responseProductos = await axios.get("http://localhost:5000/productos");

      // Obtener detalle_stands
      const responseDetalles = await axios.get("http://localhost:5000/detalle_stands");

      // Mapeamos los productos para combinar datos del detalle_stands
      const productosCombinados = responseProductos.data.map((producto) => {
        const detalle = responseDetalles.data.find(
          (detalle) => detalle.idProducto === producto.idProducto
        );

        return {
          ...producto,
          idDetalleStands: detalle?.idDetalleStands || null,
          cantidad: detalle?.cantidad || 0,
          estadoDetalle: detalle?.estado || 0, // Estado del detalle_stands
        };
      });

      setProductos(productosCombinados);
      setProductosFiltrados(productosCombinados); // Inicialmente, todos los productos
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products or details:", err);
      setError("Error al obtener productos o detalles del Stand Virtual.");
      setLoading(false);
    }
  };

  const handleBusqueda = (e) => {
    const valorBusqueda = e.target.value.toLowerCase();
    setBusqueda(valorBusqueda);

    // Filtrar productos basado en el filtro seleccionado
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
    setFiltro(e.target.value); // Actualizar el filtro seleccionado
    setBusqueda(""); // Limpiar la búsqueda al cambiar de filtro
    setProductosFiltrados(productos); // Restablecer los productos filtrados
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
    <div className="container mt-4">
      <h2 className="text-center text-primary font-weight-bold">
        Mercancía para Voluntarios
      </h2>
      {/* Buscador con filtro */}
      <div className="search-container">
        <select className="filter-dropdown" value={filtro} onChange={handleFiltroChange}>
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
          className="search-input"
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
  );
}

export default mercanciaVoluntariosComponent;
