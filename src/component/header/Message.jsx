import React from "react";
import author from "../../assets/img/chat-author1.png";
import author2 from "../../assets/img/chat-author2.png";
import author3 from "../../assets/img/chat-author3.png";
import author4 from "../../assets/img/chat-author4.png";
import author5 from "../../assets/img/chat-author6.png";
import SingleMessage from "./SingleMessage";
import { Link } from "react-router-dom";

function Message({ subNav, setSubNav, title }) {
  return (
    <div
      className="crancy-header__alarm crancy-header__alarm--messages"
      onMouseOver={() => {
        setSubNav(title);
      }}
    >
      <Link className="crancy-header__blink" to="/inbox">
        <svg
          width="24"
          height="22"
          viewBox="0 0 24 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.16602 11V5.58333C1.16602 3.1901 3.10612 1.25 5.49935 1.25H18.4993C20.8926 1.25 22.8327 3.1901 22.8327 5.58333V16.4167C22.8327 18.8099 20.8926 20.75 18.4993 20.75H7.66602M5.49935 6.66667L9.59565 9.39753C11.0512 10.3679 12.9475 10.3679 14.403 9.39753L18.4993 6.66667M1.16602 14.25H7.66602M1.16602 17.5H7.66602"
            stroke="#28303F"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="crancy-header__count crancy-gbcolor">9</span>
      </Link>
      <div
        className="crancy-balance crancy-alarm__hover fm-hover-animation"
        style={{ display: subNav === title ? "block" : "none" }}
      >
        <div className="crancy-alarm__hover--inner">
          <h3 className="crancy-balance__title">Recent Message</h3>
          <ul className="crancy-balance_list crancy-chatbox__list crancy-chatbox__list__header">
            {/* <!-- Single List --> */}
            <SingleMessage
              img={author}
              name="Ronald Richards"
              message="Hello there, here is the a..."
              time="10:34PM"
              unread="06"
            />
            <SingleMessage
              img={author2}
              name="Wade Warren"
              message="Hello there, here is the a..."
              time="10:34PM"
            />
            <SingleMessage
              img={author3}
              name="Albert Flores"
              message="Hello there, here is the a..."
              time="10:34PM"
              unread="06"
            />
            <SingleMessage
              img={author4}
              name="Savannah Nguyen"
              message="Hello there, here is the a..."
              time="10:34PM"
            />
            <SingleMessage
              img={author5}
              name="Esther Howard"
              message="Hello there, here is the a..."
              time="10:34PM"
              unread="06"
            />
          </ul>
        </div>
        {/* <!-- crancy Balance Button --> */}
        <div className="crancy-balance__button">
          <Link to="/inbox" className="crancy-balance__sell-all">
            See all Message
          </Link>
        </div>
      </div>
      {/* <!-- End crancy Balance Hover --> */}
    </div>
  );
}

export default Message;
