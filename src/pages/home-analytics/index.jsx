import React from "react";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Layout from "../../component/home-two/Layout";
import History from "../../component/home-two/History";
import RecentActivity from "../../component/home-two/RecentActivity";
import Map from "../../component/home-two/Map";
import ProductActivity from "../../component/home-two/ProductActivity";
import Sidebar from "../../component/home/Sidebar";
import useMenu from "../../hooks/useMenu";

function HomeAnalytics() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Dashboard Analytics" link="home-analytics" />
      <div className="row">
        <div className="col-xxl-9 col-12 crancy-main__column">
          <div className="crancy-body">
            {/* <!-- Dashboard Inner --> */}
            <div className="crancy-dsinner">
              <History />
              <div className="row">
                <RecentActivity />
                <Map />
              </div>
              <ProductActivity />
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    </Layout>
  );
}

export default HomeAnalytics;
