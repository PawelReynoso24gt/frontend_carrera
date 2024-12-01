import React from "react";

function ProductCard({ producto }) {
  const { nombreProducto, descripcion, precio, estado } = producto;

  return (
    <div className="col-xxl-3 col-lg-4 col-md-6 col-12">
      <div className="crancy-single-user mg-top-30">
        <div className="crancy-single-user__head">
          <h4 className="crancy-single-user__title">
            {nombreProducto}
            <span style={{ display: "block", fontSize: "14px", color: "#888" }}>
              {estado === 1 ? "Activo" : "Inactivo"}
            </span>
          </h4>
          <p className="crancy-single-user__label">{descripcion}</p>
        </div>
        <div className="crancy-single-user__info">
          <ul className="crancy-single-user__list">
            <li>
              <strong>Precio:</strong> Q{parseFloat(precio).toFixed(2)}
            </li>
          </ul>
        </div>
        <button
          className={`crancy-btn__default ${
            estado === 1 ? "btn-success" : "btn-secondary"
          }`}
          style={{ width: "100%", marginTop: "10px" }}
        >
          {estado === 1 ? "Disponible" : "No Disponible"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
