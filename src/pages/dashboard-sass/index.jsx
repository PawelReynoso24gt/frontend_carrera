import React from "react";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Layout from "../../component/home-two/Layout";
import Sidebar from "../../component/home/Sidebar";
import ProjectInfo from "../../component/home-three/ProjectInfo";
import ActivitySection from "../../component/home/ActivitySection";
import InnerWrapper from "../../component/home-three/InnerWrapper";
import useMenu from "../../hooks/useMenu";

function DashboardSass() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Dashboard Sass" link="dashboard-sass" />
      <div className="row">
        <InnerWrapper>
          <ProjectInfo />
          <ActivitySection />
        </InnerWrapper>
        <Sidebar />
      </div>
    </Layout>
  );
}

export default DashboardSass;
