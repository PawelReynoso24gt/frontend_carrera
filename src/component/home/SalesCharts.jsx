import React from "react";
import SaleHistory from "./SaleHistory";
import VisitorSource from "./VisitorSource";

function SalesCharts() {
  return (
    <div className="row crancy-gap-30">
      <SaleHistory />
      <VisitorSource />
    </div>
  );
}

export default SalesCharts;
