import React from "react";
import Countries from "../cards/Countries";
import TopSeller from "../cards/TopSeller";
import CalenderSm from "../cards/CalenderSm";

function Sidebar() {
  return (
    <div className="col-xxl-3 col-12 crancy-main__sidebar">
      <div className="crancy-sidebar mg-top-30">
        <div className="row">
          <Countries />
          <CalenderSm />
          <TopSeller />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
