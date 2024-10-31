import React, { useEffect, useRef } from "react";
import LineChart from "../chart/LineChart";
import SelectInput from "../form/SelectInput";

const data = {
  labels: [
    "Jan 1",
    "Jan 2",
    "Jan 3",
    "Jan 4",
    "Jan 5",
    "Jan 6",
    "Jan 7",
    "Jan 8",
    "Jan 9",
    "Jan 10",
    "Jan 11",
    "Jan 12",
    "Jan 13",
    "Jan 14",
    "Jan 15",
  ],
  datasets: [
    {
      label: "Visitors",
      data: [-25, 75, 30, -5, 30, 50, -10, 55, -10, -45, 20, -30, 40, 50, 70],
      backgroundColor: "transparent",
      borderColor: "#F2C94C",
      borderWidth: 4,
      fill: true,
      fillColor: "#fff",
      tension: 0.4,
      pointRadius: 2,
    },
    {
      label: "Sells",
      data: [10, 20, 40, 30, 20, 25, 10, -25, 10, 45, -10, 50, 40, 30, 60],
      backgroundColor: ["rgba(34, 197, 94,0.41)", "rgba(255, 255, 255, 0)"],
      borderColor: "#0A82FD",
      borderWidth: 4,
      tension: 0.4,
      fillColor: "#fff",
      fill: "start",
      pointRadius: 2,
    },
  ],
};

const options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      ticks: {
        color: "#9AA2B1",
      },
      grid: {
        drawBorder: false,
        color: "#E4F2FF",
        lineWidth: 2,
      },
      suggestedMax: 100,
      suggestedMin: 100,
    },
    y: {
      grid: {
        drawBorder: false,
        color: "#E4F2FF",
        lineWidth: 2,
      },
      suggestedMax: 100,
      suggestedMin: 100,
      ticks: {
        color: "#9AA2B1",
        callback: function (value, index, values) {
          return value + "%";
        },
      },
    },
  },
  plugins: {
    tooltip: {
      padding: 10,
      displayColors: true,
      yAlign: "bottom",
      backgroundColor: "#fff",
      titleColor: "#000",
      titleFont: { weight: "normal" },
      bodyColor: "#2F3032",
      cornerRadius: 12,
      boxPadding: 3,
      usePointStyle: true,
      borderWidth: 0,
      font: {
        size: 14,
      },
      caretSize: 9,
      bodySpacing: 100,
    },
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: false,
      text: "Sell History",
    },
  },
};

const createGradient = (ctx) => {
  const gradient = ctx.createLinearGradient(400, 100, 100, 400);
  gradient.addColorStop(0, "rgba(10, 130, 253, 0.19)");
  gradient.addColorStop(1, "rgba(10, 130, 253, 0)");
  return gradient;
};

function AnalyticsConversions({ title }) {
  const chartRef = useRef(null);

  useEffect(() => {
    // // Get canvas context and create gradient
    const ctx = chartRef?.current?.getContext("2d")?.chart.ctx;
    if (ctx) {
      const gradient = createGradient(ctx);
      // Update chart data and options
      chartRef.current.data.datasets[1].backgroundColor = gradient;
      chartRef.current.update();
    }
  }, []);
  return (
    <div className="row">
      <div className="col-12">
        {/* <!-- Charts Three --> */}
        <div className="charts-main  mg-top-30">
          <div className="charts-main__heading mg-btm-30">
            <h4 className="charts-main__title">
              {title ? title : "Analytics Conversions"}
            </h4>
            <div className="charts-main__middle">
              <ul className="crancy-progress-list crancy-progress-list__inline crancy-gap-50">
                <li>
                  <span className="crancy-progress-list__color crancy-color1__bg"></span>
                  <p>Visitors</p>
                </li>
                <li>
                  <span className="crancy-progress-list__color crancy-color9__bg"></span>
                  <p>Sells</p>
                </li>
              </ul>
            </div>
            <SelectInput
              options={[" Last 7 Days", " Last 15 Days", "Last Month"]}
            />
          </div>
          <div className="charts-main__three">
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active "
                id="m_history"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <div className="crancy-chart__inside crancy-chart__three">
                  <LineChart options={options} data={data} refer={chartRef} />
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="m_history"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <div className="crancy-chart__inside crancy-chart__three">
                  {/* <LineChart options={options} data={data} refer={chartRef} /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- End Charts Three --> */}
      </div>
    </div>
  );
}

export default AnalyticsConversions;
