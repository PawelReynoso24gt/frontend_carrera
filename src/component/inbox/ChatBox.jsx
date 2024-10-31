import React from "react";
import senderImg from "../../assets/img/chat-top-ms.png";
import optionIcon from "../../assets/img/toggle-icon2.svg";
import incomingAuthor from "../../assets/img/chat-author11.png";
import outgoingAuthor from "../../assets/img/chat-author12.png";
import NewMessage from "../form/NewMessage";

export const IncomingMessage = ({ message, time, authorImg, isTyping }) => {
  return (
    <div className="crancy-chatbox__incoming">
      <ul className="crancy-chatbox__incoming-list">
        {/* <!-- Single Incoming --> */}
        <li>
          <div className="crancy-chatbox__chat">
            <div className="crancy-chatbox__author-img">
              <img src={authorImg} alt="#" />
            </div>
            <div className="crancy-chatbox__main-content">
              <div className="crancy-chatbox__incoming-chat">
                <p className="crancy-chatbox__incoming-text">
                  {message}{" "}
                  {isTyping ? (
                    <span className="crancy-chatbox__typing">is typing...</span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
              <p className="crancy-chatbox__time  crancy-chatbox__time-two">
                {time}
              </p>
            </div>
          </div>
        </li>
        {/* <!-- End Single Incoming --> */}
      </ul>
    </div>
  );
};

export const OutgoingMessage = ({ message, time, authorImg }) => {
  return (
    <div className="crancy-chatbox__incoming crancy-chatbox__outgoing">
      <ul className="crancy-chatbox__incoming-list">
        {/* <!-- Single Incoming --> */}
        <li>
          <div className="crancy-chatbox__chat">
            <div className="crancy-chatbox__main-content">
              <p className="crancy-chatbox__time  crancy-chatbox__time-two">
                {time}
              </p>
              <div className="crancy-chatbox__incoming-chat">
                <p className="crancy-chatbox__incoming-text">{message}</p>
              </div>
            </div>
            <div className="crancy-chatbox__author-img">
              <img src={authorImg} alt="#" />
            </div>
          </div>
        </li>
        {/* <!-- End Single Incoming --> */}
      </ul>
    </div>
  );
};

function ChatBox() {
  return (
    <div className="col-lg-8 col-md-8 col-12  crancy-chatbox__two">
      <div className="crancy-chatbox__explore">
        <div className="crancy-chatbox__explore-head">
          <div className="crancy-chatbox__author">
            <div className="crancy-chatbox__author-img--head">
              <img src={senderImg} alt="#" />
            </div>
            <div className="crancy-chatbox__heading">
              <h4 className="crancy-chatbox__heading--title">
                Leslie Alexander
              </h4>
              <p className="crancy-chatbox__heading--text crancy-pcolor">
                Typing...
              </p>
            </div>
          </div>
          <div className="crancy-chatbox__toggle">
            <img src={optionIcon} />
          </div>
        </div>

        <div className="crancy-chatbox__explore-body">
          <IncomingMessage
            time="09:30 AM"
            message="Hi! I had about question about my last transaction"
            authorImg={incomingAuthor}
          />
          <OutgoingMessage
            time="10:00 PM"
            message="Hi, What can I help you with?"
            authorImg={outgoingAuthor}
          />
          <IncomingMessage
            time="11.32 PM"
            message="Is this possible to refund?"
            authorImg={incomingAuthor}
          />
          <OutgoingMessage
            time="11:55 PM"
            message=" Of course, it is available in 38 and several other sizes which are very complete"
            authorImg={outgoingAuthor}
          />

          <IncomingMessage
            time="11.59 PM"
            message="Eleanor Pena"
            authorImg={incomingAuthor}
            isTyping
          />
          <NewMessage />
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
