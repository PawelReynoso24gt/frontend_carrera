import React from "react";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Layout from "../../component/home-two/Layout";
import ActivitySection from "../../component/home/ActivitySection";
import InnerWrapper from "../../component/home-three/InnerWrapper";
import AnalyticsConversions from "../../component/home/AnalyticsConversions";
import useMenu from "../../hooks/useMenu";
import Sidebar from "../../component/home/Sidebar";

function Statistics() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Statistics" link="statistics" />
      <div className="row">
        <InnerWrapper>
          <AnalyticsConversions title="Market History" />
          <ActivitySection />
        </InnerWrapper>
        <Sidebar />
      </div>
    </Layout>
  );
}

export default Statistics;
