import React from "react";

function NotificationItem({ img, title, desc, isActive, setActive }) {
  return (
    <li className="crancy-paymentm__single crancy-paymentm__single--notify">
      <div className="crancy-paymentm__name">
        <div className="crancy-paymentm__icon crancy-paymentm__icon--notify ntfmax__bgc--2">
          <img src={img} />
        </div>
        <div className="crancy-paymentm__content">
          <h4 className="crancy-paymentm__title crancy-paymentm__title--notify">
            {title}
          </h4>
          <p className="crancy-paymentm__text crancy-paymentm__text--notify">
            {desc}
          </p>
        </div>
      </div>
      <button
        aria-label="none"
        type="button"
        className={`notification-switch  ${
          isActive[title] ? "notification-switch-active" : ""
        }`}
        role="switch"
        aria-checked="false"
        aria-labelledby="availability-label"
        aria-describedby="availability-description"
        onClick={() => setActive(title)}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isActive ? "translate-x-5" : "translate-x-0"
          }`}
        ></span>
      </button>
    </li>
  );
}

export default NotificationItem;
