import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/faq/Wrapper";
import Cta from "../../component/faq/Cta";
import Accordion from "../../component/faq/Accordion";
import QuestionCom from "../../component/faq/QuestionCom";
import useMenu from "../../hooks/useMenu";

function Faq() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Faq" link="/faq" />
      <Wrapper>
        <Cta />
        <Accordion />
        <QuestionCom />
      </Wrapper>
    </Layout>
  );
}

export default Faq;
