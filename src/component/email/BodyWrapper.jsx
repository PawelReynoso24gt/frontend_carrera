import React from "react";

function BodyWrapper({ children }) {
  return (
    <div className="crancy-chatbox__main crancy-chatbox__message">
      <div className="crancy-chatbox crancy-chatbox--explore">
        <div className="row g-0">{children} </div>
      </div>
    </div>
  );
}

export default BodyWrapper;
