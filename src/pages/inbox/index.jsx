import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Notifications from "../../component/inbox/Notifications";
import Wrapper from "../../component/inbox/Wrapper";
import ChatBox from "../../component/inbox/ChatBox";
import useMenu from "../../hooks/useMenu";

function Inbox() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Inbox" link="/inbox" />
      <Wrapper>
        <Notifications />
        <ChatBox />
      </Wrapper>
    </Layout>
  );
}

export default Inbox;
