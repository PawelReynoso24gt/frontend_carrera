import React from "react";
import SearchInputV3 from "../form/SearchInputV3";
import toggleIcon from "../../assets/img/toggle-icon2.svg";
import { Link } from "react-router-dom";
import { emails } from "../../data/email";

function EmailSidebar() {
  return (
    <div className="col-lg-4 col-md-4 col-12 crancy-email__one">
      <div className="crancy-chatbox__sidebar crancy-chatbox__sidebar--inbox">
        <div className="crancy-chatbox__message--header">
          {/* <!-- Title --> */}
          <h4 className="crancy-chatbox__title">Recent Email</h4>
          {/* <!-- Element Search Form --> */}
          <div className="crancy-element__form mg-top-20">
            <SearchInputV3 />
            <div className="crancy-todolist__button">
              <Link
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#email_modal"
                className="crancy-btn crancy-sbcolor"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.09063 9.90925C7.91001 9.90925 7.77156 9.90925 7.63381 9.90925C5.46709 9.90925 3.30036 9.90995 1.13292 9.90784C0.993067 9.90784 0.849695 9.90854 0.714055 9.87903C0.284645 9.78556 -0.00209685 9.42435 1.15494e-05 8.99849C0.00211995 8.57334 0.292376 8.21424 0.722489 8.12428C0.858129 8.09618 1.0015 8.09828 1.14136 8.09828C3.30809 8.09688 5.47482 8.09758 7.64225 8.09758C7.78 8.09758 7.91775 8.09758 8.09063 8.09758C8.09063 7.924 8.09063 7.78697 8.09063 7.64993C8.09063 5.4363 8.08712 3.22267 8.09274 1.00903C8.09485 0.247964 8.77235 -0.218656 9.39784 0.1032C9.78719 0.303481 9.90596 0.650635 9.90456 1.07017C9.89964 3.26061 9.90245 5.45106 9.90245 7.6408C9.90245 7.77924 9.90245 7.91698 9.90245 8.09828C10.069 8.09828 10.2054 8.09828 10.341 8.09828C12.5548 8.09828 14.7686 8.09547 16.9824 8.10039C17.7478 8.1018 18.2159 8.76729 17.9003 9.39695C17.7042 9.78908 17.3591 9.91276 16.9396 9.91206C14.749 9.90784 12.559 9.90995 10.3684 9.90995C10.23 9.90995 10.0908 9.90995 9.90245 9.90995C9.90245 10.0695 9.90245 10.2051 9.90245 10.34C9.90245 12.4953 9.90245 14.6506 9.90245 16.8052C9.90245 16.9107 9.90737 17.0168 9.89894 17.1215C9.85958 17.6387 9.47444 18.0069 8.98389 17.9999C8.5081 17.9929 8.13491 17.6296 8.09485 17.1306C8.08642 17.0259 8.09134 16.9198 8.09134 16.8144C8.09134 14.671 8.09134 12.5277 8.09134 10.3843C8.09063 10.2438 8.09063 10.1046 8.09063 9.90925Z"
                    fill="white"
                  />
                </svg>
                Compose
              </Link>
            </div>
          </div>
          {/* <!-- End Element Search Form --> */}
        </div>

        {/* <!-- Chatbox List --> */}
        <ul className="crancy-chatbox__list">
          {emails?.map((email) => (
            <li key={email.id}>
              <div className="crancy-chatbox__inner">
                <div className="crancy-chatbox__author crancy-chatbox__email">
                  <div className="crancy-chatbox__author-img">
                    {email.authorImg ? (
                      <img src={email.authorImg} alt="#" />
                    ) : (
                      <svg
                        width="25"
                        height="19"
                        viewBox="0 0 25 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12.4663 18.9979C9.1257 18.9979 5.78401 19.0022 2.44338 18.9958C1.15323 18.9937 0.280795 18.3423 0.0513187 17.2256C0.00584633 17.0056 0.00267152 16.774 0.00267152 16.5477C0.000556524 11.8429 -0.00155305 7.1381 0.00161944 2.4333C0.00267694 0.903102 0.877226 0.00845997 2.41377 0.00634498C9.11195 -0.00211499 15.8101 -0.00211499 22.5094 0.00634498C24.066 0.00845997 24.9268 0.905217 24.9279 2.47666C24.93 7.1656 24.93 11.8545 24.9279 16.5424C24.9268 18.1033 24.0554 18.9905 22.4903 18.9948C19.1487 19.0043 15.808 18.9979 12.4663 18.9979ZM2.81138 1.49742C5.9955 4.76614 9.22616 8.0835 12.3701 11.311C15.6885 7.99362 18.9477 4.73441 22.1858 1.49742C15.734 1.49742 9.20607 1.49742 2.81138 1.49742ZM9.6904 10.5739C7.31527 12.949 5.02155 15.2438 2.77543 17.4899C9.2029 17.4899 15.7372 17.4899 22.2397 17.4899C19.9481 15.1983 17.6629 12.9131 15.3512 10.6003C14.6575 11.3004 13.9299 12.0396 13.196 12.7724C12.6905 13.2769 12.3331 13.2811 11.8308 12.7735C11.0884 12.0259 10.3609 11.2645 9.6904 10.5739ZM1.4948 2.53059C1.4948 7.22165 1.4948 11.7974 1.4948 16.3182C3.79063 14.0213 6.09703 11.7128 8.29979 9.50901C6.07693 7.22905 3.81707 4.91207 1.4948 2.53059ZM16.6329 9.46354C18.9075 11.7393 21.1928 14.0235 23.4347 16.2664C23.4347 11.7816 23.4347 7.20578 23.4347 2.66172C21.1473 4.94908 18.86 7.23645 16.6329 9.46354Z" />
                      </svg>
                    )}
                  </div>
                  <div className="crancy-chatbox__author-content">
                    <h4 className="crancy-chatbox__author-title">
                      {email.title}
                    </h4>
                    <p className="crancy-chatbox__author-meta">
                      <span>By {email.author}</span> {email.time}
                    </p>
                  </div>
                </div>
                <div className="crancy-chatbox__right crancy-chatbox__right__message">
                  <span
                    className={`crancy-chatbox__stared ${
                      email.isImportant ? "" : "crancy-chatbox__stared--no"
                    } `}
                  >
                    <i
                      className={`${
                        email.isImportant ? "fa" : "fa-regular"
                      } fa-star`}
                    ></i>
                  </span>
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

export default EmailSidebar;
