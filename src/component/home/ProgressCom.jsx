import React from "react";
import ProgressCard from "../cards/ProgressCard";

function ProgressCom() {
  return (
    <div className="row">
      <ProgressCard
        count="$7,245.00"
        name="Total Sells"
        totalSale="+ 3.5%"
        color="#0A82FD"
        progressSettings={{
          value: 11.5,
          maxValue: 100,
          style: {
            strokeLinecap: "round",
            textSize: "18px",
            pathTransitionDuration: 0.5,
            trailColor: "#CEE6FF",
            backgroundColor: "#3e98c7",
          },
        }}
      />
      <ProgressCard
        count="$7,245.00"
        name="Total Visit"
        totalSale="+ 3.5%"
        color="#EF5DA8"
        progressSettings={{
          value: 34.4,
          maxValue: 100,
          style: {
            trailColor: "#FCDFEE",
          },
        }}
      />
      <ProgressCard
        count="$10,245.00"
        name="Total Click"
        totalSale="+ 3.5%"
        color="#27AE60"
        progressSettings={{
          value: 54.2,
          maxValue: 100,
          style: {
            trailColor: "#D4EFDF",
          },
        }}
      />
      <ProgressCard
        count="$80,245.00"
        name="Insprations"
        totalSale="+ 3.5%"
        color="#9B51E0"
        progressSettings={{
          value: 77.5,
          maxValue: 100,
          style: {
            trailColor: "#EBDCF9",
          },
        }}
      />
    </div>
  );
}

export default ProgressCom;
