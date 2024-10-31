import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/calendar/Wrapper";
import CalenderCom from "../../component/calendar/CalenderCom";
import Sidebar2 from "../../component/calendar/Sidebar2";
import useMenu from "../../hooks/useMenu";

function Calendar() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Calendar" link="/calendar" />
      <Wrapper>
        <CalenderCom />
        <Sidebar2 />
      </Wrapper>
    </Layout>
  );
}

export default Calendar;
