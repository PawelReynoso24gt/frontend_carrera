import React, { useState } from "react";
import image from "../../assets/img/faq-img.png";
import AccrodionCard from "../cards/AccrodionCard";

function Accordion() {
  const [active, setActive] = useState(1);

  return (
    <div className="row pd-top-20 align-items-center">
      <div className="col-lg-5 col-md-6 col-12 mg-top-30">
        <div
          className="crancy-accordion accordion accordion-flush"
          id="crancy-accordion"
        >
          <AccrodionCard
            title="Do I have to host a home to host an experience?"
            desc=" Depending on activities involved, certain experiences may
            require a business license. Make sure to check local laws in
            your area to determine which licenses may required for your
            experience, especially if there is food, alcohol, or
            transportation involved."
            isOpen={active}
            handleOpen={setActive}
            id={1}
          />
          <AccrodionCard
            title="What’s the time commitment?"
            desc=" Depending on activities involved, certain experiences may
          require a business license. Make sure to check local laws in
          your area to determine which licenses may required for your
          experience, especially if there is food, alcohol, or
          transportation involved."
            isOpen={active}
            handleOpen={setActive}
            id={2}
          />
          <AccrodionCard
            title="Do I need a business license?"
            desc=" Depending on activities involved, certain experiences may
        require a business license. Make sure to check local laws in
        your area to determine which licenses may required for your
        experience, especially if there is food, alcohol, or
        transportation involved."
            isOpen={active}
            handleOpen={setActive}
            id={3}
          />
          <AccrodionCard
            title="Do I need insurance?"
            desc=" Depending on activities involved, certain experiences may
      require a business license. Make sure to check local laws in
      your area to determine which licenses may required for your
      experience, especially if there is food, alcohol, or
      transportation involved."
            isOpen={active}
            handleOpen={setActive}
            id={4}
          />
          <AccrodionCard
            title="Can I set a minimum number of guests per experience?"
            desc=" Depending on activities involved, certain experiences may
    require a business license. Make sure to check local laws in
    your area to determine which licenses may required for your
    experience, especially if there is food, alcohol, or
    transportation involved."
            isOpen={active}
            handleOpen={setActive}
            id={5}
          />
          <AccrodionCard
            title="Can I host with someone else?"
            desc=" Depending on activities involved, certain experiences may
  require a business license. Make sure to check local laws in
  your area to determine which licenses may required for your
  experience, especially if there is food, alcohol, or
  transportation involved."
            isOpen={active}
            handleOpen={setActive}
            id={6}
          />
        </div>
      </div>
      <div className="col-lg-6 offset-lg-1 col-md-6 col-12 mg-top-30">
        <div className="crancy-faq__img">
          <img src={image} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Accordion;
