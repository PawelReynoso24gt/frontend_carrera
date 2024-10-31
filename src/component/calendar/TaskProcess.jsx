import React from "react";
import SelectInput from "../form/SelectInput";
import DoughnutChart from "../chart/Doughnut";

const data = {
  labels: ["Total Task", "Completed Task"],
  datasets: [
    {
      label: "My First Dataset",
      data: [22, 78],
      backgroundColor: ["#E4F2FF", "#F2C94C"],
      hoverOffset: 2,
      borderWidth: 0,
    },
  ],
};

const options = {
  responsive: true,
  cutout: 105,
  plugins: {
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
function TaskProcess({ className }) {
  return (
    <div className="crancy-sidebar__single">
      <div className="crancy-sidebar__heading">
        <h3 className="crancy-sidebar__title m-0">Task Progress</h3>
        <SelectInput
          options={["Weekly", "Last 7 Days", "Last 15 Days", "Last 30 Days"]}
        />
      </div>
      <div className="crancy-flex-center">
        <div className="crancy-task__chart crancy-chart__inside crancy-chart_ptask">
          <DoughnutChart data={data} options={options} />
          <div className="myChart-progress">
            <h4 className="myChart-progress__number">
              78<span>%</span>
            </h4>
            <p className="myChart-progress__text">Task Completed</p>
          </div>
        </div>
      </div>
      <div className="charts-main__middle justify-content-center mg-top-20">
        <ul className="crancy-progress-list crancy-progress-list__inline">
          <li>
            <span className="crancy-progress-list__color crancy-color9__bg"></span>
            <p>
              <span>Total Task</span> <b>:</b> 18
            </p>
          </li>
          <li>
            <span className="crancy-progress-list__color crancy-offwhite__bg"></span>
            <p>
              <span>Completed Task</span> <b>:</b> 243
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TaskProcess;
