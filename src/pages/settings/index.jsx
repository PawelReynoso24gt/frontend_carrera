import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/settings/Wrapper";
import Sidebar from "../../component/settings/Sidebar";
import { Outlet } from "react-router-dom";
import useMenu from "../../hooks/useMenu";

function Settings({ children }) {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Settings" link="/settings" />
      <Wrapper>
        <div className="row">
          <Sidebar />
          <div className="col-lg-9 col-md-10 col-12  crancy-personals__content mg-top-30">
            <Outlet />
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}

export default Settings;
