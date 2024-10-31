import React from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/teams/Wrapper";
import AddNewMember from "../../component/form/AddNewMember";
import BodyWrapper from "../../component/teams/BodyWrapper";
import TeamCard from "../../component/cards/TeamCard";
import { teams } from "../../data/teams";
import Pagination from "../../component/teams/Pagination";
import useMenu from "../../hooks/useMenu";

function Teams() {
  useMenu();
  return (
    <Layout>
      <BreadCrumb title="Profile" link="/teams" />
      <Wrapper>
        <h3 className="crancy-teams__title mg-btm-20">Our Team</h3>
        <AddNewMember />
        <BodyWrapper>
          {teams?.map((profile) => (
            <TeamCard profile={profile} key={profile.id} />
          ))}
        </BodyWrapper>
        <Pagination />
      </Wrapper>
    </Layout>
  );
}

export default Teams;
