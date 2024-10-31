import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import TransactionsCom from "../../component/transactions/TransactionsCom";
import Sidebar from "../../component/home/Sidebar";
import useMenu from "../../hooks/useMenu";

function Transaction() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Transaction" link="/transaction" />
      <div className="row">
        <TransactionsCom />
        <Sidebar />
      </div>
    </Layout>
  );
}

export default Transaction;
