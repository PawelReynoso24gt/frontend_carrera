import React from "react";
import payment1 from "../../../assets/img/payment-1.png";
import payment2 from "../../../assets/img/payment-2.png";
import payment3 from "../../../assets/img/payment-3.png";
import payment4 from "../../../assets/img/payment-4.png";

function PaymentMethod() {
  return (
    <div className="tab-pane fade show active">
      <form action="#">
        <div className="crancy-paymentm crancy__item-group">
          <h4 className="crancy__item-group__title">Payment Method</h4>
          <ul className="crancy-paymentm__list">
            <li className="crancy-paymentm__single">
              <div className="crancy-paymentm__name">
                <div className="crancy-paymentm__icon">
                  <img src={payment1} alt="#" />
                </div>
                <div className="crancy-paymentm__content">
                  <h4 className="crancy-paymentm__title">
                    Datch Bangla Bank Lmd
                  </h4>
                  <p className="crancy-paymentm__text">Bank **********5535</p>
                  <span className="crancy-paymentm__badge crancy__ok">
                    Verified
                  </span>
                </div>
              </div>
              <div className="crancy-paymentm__manage-btn">
                <button className="crancy-btn crancy-sbcolor">Manage</button>
              </div>
            </li>
            <li className="crancy-paymentm__single">
              <div className="crancy-paymentm__name">
                <div className="crancy-paymentm__icon">
                  <img src={payment2} alt="#" />
                </div>
                <div className="crancy-paymentm__content">
                  <h4 className="crancy-paymentm__title">Master Card</h4>
                  <p className="crancy-paymentm__text">Bank **********5535</p>
                  <span className="crancy-paymentm__badge crancy__ok">
                    Verified
                  </span>
                </div>
              </div>
              <div className="crancy-paymentm__manage-btn">
                <button className="crancy-btn crancy-sbcolor">Manage</button>
              </div>
            </li>
            <li className="crancy-paymentm__single">
              <div className="crancy-paymentm__name">
                <div className="crancy-paymentm__icon">
                  <img src={payment3} alt="#" />
                </div>
                <div className="crancy-paymentm__content">
                  <h4 className="crancy-paymentm__title">Paypal Account</h4>
                  <p className="crancy-paymentm__text">Bank **********5535</p>
                  <span className="crancy-paymentm__badge crancy__ok">
                    Verified
                  </span>
                </div>
              </div>
              <div className="crancy-paymentm__manage-btn">
                <button className="crancy-btn crancy-sbcolor">Manage</button>
              </div>
            </li>
            <li className="crancy-paymentm__single">
              <div className="crancy-paymentm__name">
                <div className="crancy-paymentm__icon">
                  <img src={payment4} alt="#" />
                </div>
                <div className="crancy-paymentm__content">
                  <h4 className="crancy-paymentm__title">Visa Card</h4>
                  <p className="crancy-paymentm__text">Bank **********5535</p>
                  <span className="crancy-paymentm__badge crancy__error">
                    Unverified
                  </span>
                </div>
              </div>
              <div className="crancy-paymentm__manage-btn">
                <button className="crancy-btn crancy-sbcolor">Manage</button>
              </div>
            </li>
          </ul>
        </div>
        <div className="crancy__item-button--group crancy__ptabs-bottom v2">
          <button className="crancy-btn crancy-gbcolor">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.95037 13.9996C6.35389 13.9778 5.84216 13.5247 5.79077 12.9295C5.75578 12.5223 5.76999 12.1102 5.76944 11.7003C5.76726 10.5618 5.7689 9.42333 5.7689 8.23184C5.62565 8.23184 5.51904 8.23184 5.41243 8.23184C4.04562 8.23184 2.67826 8.23676 1.31144 8.22965C0.515412 8.22528 -0.0324072 7.67381 0.00148975 6.93596C0.0282793 6.35169 0.476594 5.86143 1.05776 5.78819C1.1928 5.77125 1.33058 5.76961 1.46671 5.76906C2.77886 5.76797 4.09154 5.76852 5.40368 5.76852C5.51084 5.76852 5.61855 5.76852 5.7689 5.76852C5.7689 5.63625 5.7689 5.53077 5.7689 5.42528C5.7689 4.05835 5.76507 2.69141 5.77054 1.32448C5.77382 0.535255 6.29867 -0.0113003 7.02309 0.000177399C7.63159 0.0100154 8.15645 0.464749 8.20893 1.07088C8.24447 1.47806 8.22971 1.89016 8.2308 2.30008C8.23299 3.43855 8.23135 4.57703 8.23135 5.75376C8.35163 5.75922 8.45605 5.76797 8.56048 5.76797C9.93659 5.76906 11.3127 5.7636 12.6888 5.7707C13.4641 5.77453 14.0042 6.29485 13.9999 7.00865C13.996 7.62954 13.534 8.14603 12.9162 8.2149C12.7899 8.22911 12.6615 8.23075 12.5341 8.23075C11.2219 8.23184 9.90925 8.23129 8.59711 8.23129C8.4894 8.23129 8.38225 8.23129 8.23135 8.23129C8.23135 8.36356 8.23135 8.4685 8.23135 8.57398C8.23135 9.94092 8.23572 11.3078 8.22916 12.6748C8.22588 13.4777 7.68736 14.0264 6.95037 13.9996Z" />
            </svg>
            Add Bank
          </button>
          <button className="crancy-btn crancy-ybcolor">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.95037 13.9996C6.35389 13.9778 5.84216 13.5247 5.79077 12.9295C5.75578 12.5223 5.76999 12.1102 5.76944 11.7003C5.76726 10.5618 5.7689 9.42333 5.7689 8.23184C5.62565 8.23184 5.51904 8.23184 5.41243 8.23184C4.04562 8.23184 2.67826 8.23676 1.31144 8.22965C0.515412 8.22528 -0.0324072 7.67381 0.00148975 6.93596C0.0282793 6.35169 0.476594 5.86143 1.05776 5.78819C1.1928 5.77125 1.33058 5.76961 1.46671 5.76906C2.77886 5.76797 4.09154 5.76852 5.40368 5.76852C5.51084 5.76852 5.61855 5.76852 5.7689 5.76852C5.7689 5.63625 5.7689 5.53077 5.7689 5.42528C5.7689 4.05835 5.76507 2.69141 5.77054 1.32448C5.77382 0.535255 6.29867 -0.0113003 7.02309 0.000177399C7.63159 0.0100154 8.15645 0.464749 8.20893 1.07088C8.24447 1.47806 8.22971 1.89016 8.2308 2.30008C8.23299 3.43855 8.23135 4.57703 8.23135 5.75376C8.35163 5.75922 8.45605 5.76797 8.56048 5.76797C9.93659 5.76906 11.3127 5.7636 12.6888 5.7707C13.4641 5.77453 14.0042 6.29485 13.9999 7.00865C13.996 7.62954 13.534 8.14603 12.9162 8.2149C12.7899 8.22911 12.6615 8.23075 12.5341 8.23075C11.2219 8.23184 9.90925 8.23129 8.59711 8.23129C8.4894 8.23129 8.38225 8.23129 8.23135 8.23129C8.23135 8.36356 8.23135 8.4685 8.23135 8.57398C8.23135 9.94092 8.23572 11.3078 8.22916 12.6748C8.22588 13.4777 7.68736 14.0264 6.95037 13.9996Z" />
            </svg>
            Add Bank
          </button>
        </div>
      </form>
    </div>
  );
}

export default PaymentMethod;
