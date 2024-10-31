import React from "react";
import NotificationsCom from "../../../component/notifications/NotificationsCom";

function NotificationSetting() {
  return (
    <div className="tab-pane fade show active">
      <NotificationsCom isSettings={true} />
    </div>
  );
}

export default NotificationSetting;
