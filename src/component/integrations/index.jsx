import React from "react";
import { integrations } from "../../data/integrations";
import IntegrationCard from "../cards/IntegrationCard";

function IntegrationsCom() {
  return (
    <div className="row">
      <div className="col-12">
        <div className="crancy-body">
          <div className="crancy-dsinner">
            <div className="row">
              {integrations?.map((integration) => (
                <IntegrationCard
                  integration={integration}
                  key={integration.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntegrationsCom;
