import React from "react";
import { Link } from "react-router-dom";
import editIcon from "../../assets/img/edit-icon2.svg";
import toggleIcon from "../../assets/img/toggle-icon2.svg";
import SearchFormV2 from "../form/SearchFormV2";
import { conversionList } from "../../data/message";

function Notifications() {
  return (
    <div className="col-lg-4 col-md-4 col-12 crancy-chatbox__one">
      <div className="crancy-chatbox__sidebar">
        <div className="crancy-chatbox__first-group">
          <h4 className="crancy-sidebar__title">Messages (22)</h4>
          <div className="crancy-chatbox__edit">
            <Link to="#">
              <img src={editIcon} alt="" />
            </Link>
          </div>
        </div>
        <SearchFormV2 />
        {/* <!-- Chatbox List --> */}
        <ul className="crancy-chatbox__list">
          {/* <!-- Single List --> */}
          {conversionList?.map((conversion) => (
            <li key={conversion.id}>
              <div className="crancy-chatbox__inner">
                <div className="crancy-chatbox__author">
                  <div className="crancy-chatbox__author-img">
                    <img src={conversion.img} alt="#" />
                    <span className="crancy-chatbox__author-online"></span>
                  </div>
                  <div className="crancy-chatbox__author-content">
                    <h4 className="crancy-chatbox__author-title">
                      {conversion.name}
                    </h4>
                    <p className="crancy-chatbox__author-desc">
                      {conversion.message}
                    </p>
                  </div>
                </div>
                <div className="crancy-chatbox__right">
                  <div className="crancy-chatbox__info">
                    <p className="crancy-chatbox__time">{conversion.time}</p>
                  </div>
                  <div className="crancy-chatbox__toggle">
                    <img src={toggleIcon} alt="" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notifications;
