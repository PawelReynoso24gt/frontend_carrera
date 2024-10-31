import React from "react";

function Wrapper({ children }) {
  return (
    <div className="row">
      <div className="col-12">
        <div className="crancy-body">
          <div className="crancy-dsinner">
            <div className="crancy-personals">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wrapper;
