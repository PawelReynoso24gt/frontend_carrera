import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/email/Wrapper";
import EmailHeader from "../../component/email/EmailHeader";
import BodyWrapper from "../../component/email/BodyWrapper";
import EmailSidebar from "../../component/email/EmailSidebar";
import EmailCom from "../../component/email/EmailCom";
import useMenu from "../../hooks/useMenu";

function Email() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Email" link="/email" />
      <Wrapper>
        <EmailHeader />
        <BodyWrapper>
          <EmailSidebar />
          <EmailCom />
        </BodyWrapper>
      </Wrapper>
    </Layout>
  );
}

export default Email;
