import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import TransactionsCom from "../../component/transactions/TransactionsCom";
import Sidebar4 from "../../component/history/Sidebar4";
import useMenu from "../../hooks/useMenu";

function History() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="History" link="/history" />
      <div className="row">
        <TransactionsCom className="col-xxl-8 col-12" />
        <Sidebar4 />
      </div>
    </Layout>
  );
}

export default History;
