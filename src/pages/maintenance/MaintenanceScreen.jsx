import React from 'react';
import './MaintenanceScreen.css';

const MaintenanceScreen = () => {
  return (
    <div className="maintenance-body">
      <div className="maintenance-container">
        <img src="/MaintenanceImage.png" alt="Mantenimiento" />
        <div>
          <h1>:(</h1>
          <p></p>
          <h2>¡Sentimos los inconvenientes!</h2>
          <h3>Estamos trabajando para brindarte una mejor experiencia.</h3>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;