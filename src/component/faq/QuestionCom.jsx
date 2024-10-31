import React from "react";
import QuestionForm from "../form/QuestionForm";
import img from "../../assets/img/support-img.png";

function QuestionCom() {
  return (
    <div className="row pd-top-20 align-items-center">
      <div className="col-lg-6 col-md-6 col-12 mg-top-30">
        <div className="crancy-support__img">
          <img src={img} alt="" />
        </div>
      </div>
      <div className="col-lg-6 col-md-6 col-12 mg-top-30">
        <div className="crancy-main-form crancy-main-form__contact">
          <div className="crancy-section-title text-left">
            <h3 className="crancy-section__title">Still have questions?</h3>
            <p className="crancy-section__text">
              Contrary to popular belief, orem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
            </p>
          </div>
          <QuestionForm />
        </div>
      </div>
    </div>
  );
}

export default QuestionCom;
