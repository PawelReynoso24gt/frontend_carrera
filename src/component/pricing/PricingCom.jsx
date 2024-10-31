import React from "react";
import PricingCard from "../cards/PricingCard";

function PricingCom() {
  return (
    <>
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <div className="crancy-section-title mg-btm-10">
            <h3 className="crancy-section__title">Our Pricing Plans</h3>
            <p className="crancy-section__text">
              Contrary to popular belief, orem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <PricingCard
          price="30"
          options={[
            "5 PPC Campaigns page",
            "Unlimited file share & update",
            "5 Facebook Camplaigns",
            "2 Video Campaing and else",
            "24/7 Hour Support",
          ]}
        />
        <PricingCard
          price="60"
          options={[
            "5 PPC Campaigns page",
            "Unlimited file share & update",
            "5 Facebook Camplaigns",
            "2 Video Campaing and else",
            "24/7 Hour Support",
          ]}
          color="pink"
        />
        <PricingCard
          price="90"
          options={[
            "5 PPC Campaigns page",
            "Unlimited file share & update",
            "5 Facebook Camplaigns",
            "2 Video Campaing and else",
            "24/7 Hour Support",
          ]}
          color="orange"
        />
        <PricingCard
          price="100"
          options={[
            "5 PPC Campaigns page",
            "Unlimited file share & update",
            "5 Facebook Camplaigns",
            "2 Video Campaing and else",
            "24/7 Hour Support",
          ]}
          color="blue"
        />
      </div>
    </>
  );
}

export default PricingCom;
