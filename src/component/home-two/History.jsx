import React from "react";
import HistoryCard from "../cards/HistoryCard";
import sales from "../../assets/img/sales-graph-1.svg";
import visit from "../../assets/img/sales-graph-2.svg";
import click from "../../assets/img/sales-graph-3.svg";
import inspirations from "../../assets/img/sales-graph-4.svg";
import {
  myChart_eight,
  myChart_nine,
  myChart_seven,
  myChart_ten,
} from "../../data/chartSettings";

function History() {
  return (
    <div className="row crancy-gap-30">
      <HistoryCard
        title="Total Sells"
        status="+ 3.5%"
        count="$7,245.00"
        img={sales}
        color="#0A82FD"
        chartData={myChart_seven}
        gradientColor={["rgba(10, 130, 253, 0.18) ", "rgba(10, 130, 253, 0) "]}
      />
      <HistoryCard
        title="Total Visit"
        status="+ 3.5%"
        count="$5,245.00"
        img={visit}
        color="#EF5DA8"
        chartData={myChart_eight}
        gradientColor={["rgba(239, 93, 168, 0.40)", "rgba(239, 93, 168, 0.00)"]}
      />
      <HistoryCard
        title="Total Click"
        status="+ 3.5%"
        count="$10,245.00"
        img={click}
        color="#27AE60"
        chartData={myChart_nine}
        gradientColor={["rgba(89, 190, 89, 0.40)", "rgba(89, 190, 89, 0.00)"]}
      />
      <HistoryCard
        title="Inspirations"
        status="+ 3.5%"
        count="$80,245.00"
        img={inspirations}
        color="#9B51E0"
        chartData={myChart_ten}
        gradientColor={["rgba(155, 81, 224, 0.40)", "rgba(155, 81, 224, 0.00)"]}
      />
    </div>
  );
}

export default History;
