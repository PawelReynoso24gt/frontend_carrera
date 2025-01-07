import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

function Countries() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage
    fetch("http://localhost:5000/recaudacion_evento", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}` // Incluye el token en los encabezados
      }
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Error en la respuesta del servidor:", response.status, response.statusText);
          throw new Error("Error al obtener los eventos");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Datos obtenidos del backend:", data);
        setEventos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al realizar la solicitud:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);
  

  const renderChart = () => {
    if (!eventos || eventos.length < 2) {
      return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Datos insuficientes para generar la gráfica</h2>
          <p>Se necesitan al menos 2 eventos para realizar la comparación.</p>
        </div>
      );
    }

    const sortedEvents = [...eventos].sort(
      (a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
    );
    const latestEvent = sortedEvents[0];
    const previousEvent = sortedEvents[1];

    const chartData = {
      labels: ["Evento Anterior", "Evento Más Reciente"],
      datasets: [
        {
          label: "Recaudación (Q)",
          data: [previousEvent.recaudacion, latestEvent.recaudacion],
          backgroundColor: ["#BDE038", "#36A2EB"],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: {
              size: 20, // Tamaño de la leyenda
            },
          },
        },
        title: {
          display: true,
          text: "Comparación de Recaudación entre Eventos",
          font: {
            size: 25, // Tamaño del título
            weight: "bold",
          },
          color: "#284CDB",
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 16,
            },
          },
        },
        y: {
          ticks: {
            font: {
              size: 16,
            },
          },
        },
      },
    };

    return (
      <div style={{ width: "100%", marginTop: "20px", justifyContent: "center",  }}>
        <Bar data={chartData} options={options} />
        {latestEvent.recaudacion <= previousEvent.recaudacion && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#FFE4E1",
              border: "1px solid #FF4500",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <strong>No se alcanzó la meta</strong>
            <p>
              La recaudación del evento más reciente fue menor o igual a la del
              evento anterior.
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="col-xl-12 col-lg-6 col-md-6 col-12 crancy-sidebar__widget">
      <div className="crancy-sidebar__single">
        <div className="crancy-sidebar__heading">
          <h3
            className="crancy-table__title mb-0"
            style={{
              textAlign: "center",
              display: "block",
              margin: "0 auto",
              fontWeight: "bold",
            }}
          >
            METAS CUMPLIDAS
          </h3>
        </div>
        {renderChart()}
      </div>
    </div>
  );
}

export default Countries;
