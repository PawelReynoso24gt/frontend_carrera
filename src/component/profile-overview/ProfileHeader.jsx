import React from "react";
import { Link } from "react-router-dom";
import bg from "../../assets/img/BannerAyuvi.png";

function ProfileHeader() {
  return (
    <div className="crancy-userprofile__header mg-top-30">
      <img src={bg} alt="#" />
      <div className="crancy-userprofile__right">
      </div>
    </div>
  );
}

export default ProfileHeader;
