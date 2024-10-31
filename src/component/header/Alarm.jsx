import React from "react";
import { Link } from "react-router-dom";
import notify from "../../assets/img/notify-1.png";
import notify2 from "../../assets/img/notify-2.png";
import notify3 from "../../assets/img/notify-3.png";
import notify4 from "../../assets/img/notify-4.png";

function Alarm({ subMenu, setSubMenu, title }) {
  return (
    <div className="crancy-header__alarm">
      <Link
        className="crancy-header__blink"
        to="/notifications"
        onMouseOver={() => setSubMenu(title)}
      >
        <svg
          className="crancy-header__svg--icon"
          width="20"
          height="24"
          viewBox="0 0 20 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.7601 8.7232L16.0149 8.80778L16.7601 8.7232ZM17.2446 12.9916L17.9898 12.907L17.2446 12.9916ZM2.7567 12.9916L2.01149 12.907L2.7567 12.9916ZM3.24115 8.7232L3.98637 8.80778L3.24115 8.7232ZM1.81909 15.1115L1.24798 14.6254H1.24798L1.81909 15.1115ZM18.1822 15.1115L17.6111 15.5977V15.5977L18.1822 15.1115ZM12.4598 3.73821H11.7098C11.7098 4.0588 11.9135 4.34393 12.2168 4.44778L12.4598 3.73821ZM7.54154 3.73821L7.78449 4.44778C8.08778 4.34393 8.29154 4.0588 8.29154 3.73821H7.54154ZM13.953 20.93C14.0983 20.5421 13.9017 20.1098 13.5139 19.9644C13.126 19.8191 12.6937 20.0157 12.5484 20.4035L13.953 20.93ZM7.45295 20.4035C7.30759 20.0157 6.87532 19.8191 6.48745 19.9644C6.09958 20.1098 5.90299 20.5421 6.04835 20.93L7.45295 20.4035ZM16.2593 17.7501H3.74203V19.2501H16.2593V17.7501ZM16.0149 8.80778L16.4994 13.0762L17.9898 12.907L17.5054 8.63862L16.0149 8.80778ZM3.50192 13.0762L3.98637 8.80778L2.49594 8.63862L2.01149 12.907L3.50192 13.0762ZM2.39019 15.5977C3.00798 14.8719 3.39699 14.0006 3.50192 13.0762L2.01149 12.907C1.9419 13.5201 1.68245 14.115 1.24798 14.6254L2.39019 15.5977ZM16.4994 13.0762C16.6043 14.0006 16.9933 14.8719 17.6111 15.5977L18.7533 14.6254C18.3189 14.115 18.0594 13.5201 17.9898 12.907L16.4994 13.0762ZM3.74203 17.7501C3.01081 17.7501 2.48763 17.3878 2.2444 16.9592C2.00857 16.5436 2.01273 16.0411 2.39019 15.5977L1.24798 14.6254C0.436997 15.5781 0.412252 16.7699 0.939825 17.6995C1.46 18.6162 2.49251 19.2501 3.74203 19.2501V17.7501ZM16.2593 19.2501C17.5088 19.2501 18.5413 18.6162 19.0615 17.6995C19.5891 16.7699 19.5643 15.5781 18.7533 14.6254L17.6111 15.5977C17.9886 16.0411 17.9927 16.5436 17.7569 16.9592C17.5137 17.3878 16.9905 17.7501 16.2593 17.7501V19.2501ZM13.2098 3.73821V3.62586H11.7098V3.73821H13.2098ZM17.5054 8.63862C17.206 6.00123 15.2489 3.90044 12.7027 3.02865L12.2168 4.44778C14.3125 5.1653 15.7918 6.84198 16.0149 8.80778L17.5054 8.63862ZM8.29154 3.73821V3.62586H6.79154V3.73821H8.29154ZM3.98637 8.80778C4.20948 6.84198 5.68883 5.1653 7.78449 4.44778L7.2986 3.02865C4.7524 3.90044 2.79528 6.00123 2.49594 8.63862L3.98637 8.80778ZM10.0007 1.91675C10.9446 1.91675 11.7098 2.68194 11.7098 3.62586H13.2098C13.2098 1.85351 11.773 0.416748 10.0007 0.416748V1.91675ZM10.0007 0.416748C8.22831 0.416748 6.79154 1.85351 6.79154 3.62586H8.29154C8.29154 2.68194 9.05674 1.91675 10.0007 1.91675V0.416748ZM12.5484 20.4035C12.1892 21.3617 11.2007 22.0834 10.0007 22.0834V23.5834C11.8015 23.5834 13.3659 22.4963 13.953 20.93L12.5484 20.4035ZM10.0007 22.0834C8.80065 22.0834 7.81206 21.3617 7.45295 20.4035L6.04835 20.93C6.63539 22.4963 8.19975 23.5834 10.0007 23.5834V22.0834Z" />
        </svg>
        <span className="crancy-header__count crancy-color4__bg">4</span>
      </Link>
      {/* <!-- crancy Alarm Hover --> */}
      <div
        className={`f-subMenu-overlay ${
          subMenu ? "f-subMenu-overlay-active" : ""
        }`}
        onClick={() => setSubMenu(false)}
      ></div>
      <div
        className={`crancy-balance crancy-alarm__hover fm-hover-animation ${
          subMenu === title ? "f-active" : ""
        }`}
      >
        <div className="crancy-alarm__hover--inner">
          <h3 className="crancy-balance__title">Recent Notification</h3>
          {/* <!-- crancy Balance List --> */}
          <ul className="crancy-balance_list">
            <li>
              <div className="crancy-balance-info">
                <div className="crancy-balance__img crancy-gbcolor">
                  <img src={notify} alt="#" />
                </div>
                <div className="crancy-alarm__content">
                  <h4 className="crancy-balance-name">
                    <Link to="/notifications">
                      Your Account has been created{" "}
                      <strong className="crancy-balance__second">
                        successfully done
                      </strong>
                    </Link>
                  </h4>
                  <p className="crancy-alarm__text">2 days ago</p>
                </div>
              </div>
            </li>
            <li>
              <div className="crancy-balance-info">
                <div className="crancy-balance__img crancy-color1__bg">
                  <img src={notify2} alt="#" />
                </div>
                <div className="crancy-alarm__content">
                  <h4 className="crancy-balance-name">
                    <Link to="/notifications">
                      Your Account has been created{" "}
                      <strong className="crancy-balance__second">
                        successfully done
                      </strong>
                    </Link>
                  </h4>
                  <p className="crancy-alarm__text">2 days ago</p>
                </div>
              </div>
            </li>
            <li>
              <div className="crancy-balance-info">
                <div className="crancy-balance__img crancy-color5__bg">
                  <img src={notify3} alt="#" />
                </div>
                <div className="crancy-alarm__content">
                  <h4 className="crancy-balance-name">
                    <Link to="/notifications">
                      <strong className="crancy-balance__second">
                        Thank you !
                      </strong>{" "}
                      you made your frast sell{" "}
                      <strong className="crancy-balance__second">
                        232.98 ETH
                      </strong>
                    </Link>
                  </h4>
                  <p className="crancy-alarm__text">2 days ago</p>
                </div>
              </div>
            </li>
            <li>
              <div className="crancy-balance-info">
                <div className="crancy-balance__img crancy-color7__bg">
                  <img src={notify4} alt="#" />
                </div>
                <div className="crancy-alarm__content">
                  <h4 className="crancy-balance-name">
                    <Link to="/notifications">
                      <strong className="crancy-balance__second">
                        Broklan Simons
                      </strong>
                      Start Following you
                    </Link>
                  </h4>
                  <p className="crancy-alarm__text">2 days ago</p>
                </div>
              </div>
            </li>
            <li>
              <div className="crancy-balance-info">
                <div className="crancy-balance__img crancy-color6__bg">
                  <img src={notify4} alt="#" />
                </div>
                <div className="crancy-alarm__content">
                  <h4 className="crancy-balance-name">
                    <Link to="/notifications">
                      you ranked up and now you are a
                      <strong className="crancy-balance__second">
                        Auther Master
                      </strong>
                    </Link>
                  </h4>
                  <p className="crancy-alarm__text">6 days ago</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        {/* <!-- crancy Balance Button --> */}
        <div className="crancy-balance__button">
          <Link to="/notifications" className="crancy-balance__sell-all">
            See all Notification
          </Link>
        </div>
      </div>

      {/* <!-- End crancy Balance Hover --> */}
    </div>
  );
}

export default Alarm;
