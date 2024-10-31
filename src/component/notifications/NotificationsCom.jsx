import React, { useState } from "react";
import notifyImg from "../../assets/img/anotify1.svg";
import notifyImg2 from "../../assets/img/anotify2.svg";
import notifyImg3 from "../../assets/img/anotify3.svg";
import notifyImg4 from "../../assets/img/anotify4.svg";
import notifyImg5 from "../../assets/img/anotify5.svg";
import notifyImg6 from "../../assets/img/anotify6.svg";
import notifyImg7 from "../../assets/img/anotify7.svg";

import { Link } from "react-router-dom";
import NotificationItem from "./NotificationItem.jsx";

function NotificationsCom({ isSettings }) {
  const [activeNotification, setActiveNotification] = useState({
    ["All Notification update"]: true,
    "When you upload products": false,
    "You got sell your products": true,
    "Got new follower": false,
    "Got new Sale": true,
    "Author level up": false,
    "You upload your first product successfully done": true,
    "Got new followers": false,
  });
  const handleActiveNotification = (name) => {
    setActiveNotification({
      ...activeNotification,
      [name]: !activeNotification[name],
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="crancy-body">
          {/* <!-- Dashboard Inner --> */}
          <div className="crancy-dsinner">
            <div
              className={`crancy-notifications crancy-notifications__all ${
                isSettings ? "" : "mg-top-30"
              }`}
            >
              <form action="#">
                <div className="crancy-paymentm">
                  <h4 className="crancy__notification__title mg-btm-20">
                    Notification
                  </h4>
                  <ul className="crancy-paymentm__list crancy-paymentm__list--notify pt-0">
                    <NotificationItem
                      img={notifyImg}
                      title="All Notification update"
                      isActive={activeNotification}
                      setActive={handleActiveNotification}
                      desc="Unlockable content, only revealed by the owner of
                            the item."
                    />
                    <NotificationItem
                      img={notifyImg2}
                      title="When you upload products"
                      isActive={activeNotification}
                      setActive={handleActiveNotification}
                      desc="Every new products upload successfully done you can
                      get notification"
                    />
                    <NotificationItem
                      img={notifyImg3}
                      title="You got sell your products"
                      isActive={activeNotification}
                      setActive={handleActiveNotification}
                      desc="Every new products sell you can get notification"
                    />
                    <NotificationItem
                      img={notifyImg4}
                      title="Got new follower"
                      isActive={activeNotification}
                      setActive={handleActiveNotification}
                      desc="Every new follower you can get notification"
                    />
                    <NotificationItem
                      img={notifyImg5}
                      title="Got new Sale"
                      isActive={activeNotification}
                      setActive={handleActiveNotification}
                      desc="Every new products sell you can get notification"
                    />
                    <NotificationItem
                      img={notifyImg6}
                      title="Author level up"
                      isActive={activeNotification}
                      setActive={handleActiveNotification}
                      desc="Thank you! you made your first sell $232.98"
                    />
                    <NotificationItem
                      img={notifyImg7}
                      title="You upload your first product successfully done"
                      isActive={activeNotification}
                      setActive={handleActiveNotification}
                      desc="Every new follower you can get notification"
                    />
                    <NotificationItem
                      img={notifyImg4}
                      title="Got new followers"
                      isActive={activeNotification}
                      setActive={handleActiveNotification}
                      desc="Every new follower you can get notification"
                    />
                  </ul>
                </div>
                {isSettings ? (
                  ""
                ) : (
                  <div className="crancy-balance__button">
                    <Link to="#" className="crancy-balance__sell-all">
                      See all Notification
                    </Link>
                  </div>
                )}
              </form>
            </div>
          </div>
          {/* <!-- End Dashboard Inner --> */}
        </div>
      </div>
    </div>
  );
}

export default NotificationsCom;
