import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import { Outlet } from "react-router-dom";
import Wrapper from "../../component/profile-overview/Wrapper";
import ProfileHeader from "../../component/profile-overview/ProfileHeader";
import SidebarProfile from "../../component/profile-overview/SidebarProfile";
import TabList from "../../component/profile-overview/TabList";
import useMenu from "../../hooks/useMenu";

function ProfileOverview({ children }) {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Profile Overview" link="profile-overview" />
      <Wrapper>
        <ProfileHeader />
        <div className="crancy-upinner">
          <div className="row">
            <SidebarProfile />
            <div className="col-lg-8 col-12 crancy-upinner__column2">
              <div className="crancy-upcontent mg-top-30">
                <TabList />
                <div className="tab-content" id="nav-tabContent">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}

export default ProfileOverview;
