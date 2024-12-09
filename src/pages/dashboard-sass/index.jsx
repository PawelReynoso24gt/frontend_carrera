import React from "react";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Layout from "../../component/home-two/Layout";
import Sidebar from "../../component/home/Sidebar";
import ProjectInfo from "../../component/home-three/ProjectInfo";
import ActivitySection from "../../component/home/ActivitySection";
import InnerWrapper from "../../component/home-three/InnerWrapper";
import useMenu from "../../hooks/useMenu";
import Countries from "../../component/cards/Countries";

function DashboardSass() {
  useMenu();

  const isDarkTheme = false; // Cambiar a true para el tema oscuro

  const styles = {
    dashboardBackground: {
      background: isDarkTheme
        ? "#343a40"
        : "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      color: isDarkTheme ? "#ffffff" : "#000000",
      minHeight: "100vh",
      padding: "20px",
    },
    componentWrapper: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      marginBottom: "20px",
    },
  };

  return (
    <div style={styles.dashboardBackground}>
      <Layout>
        <BreadCrumb title="ESTADÍSTICAS GENERALES" link="dashboard-sass" />
        <div className="row">
          <InnerWrapper>
            <div style={styles.componentWrapper}>
              <Countries />
            </div>
            <div style={styles.componentWrapper}>
              <ProjectInfo />
            </div>
            <div style={styles.componentWrapper}>
              <ActivitySection />
            </div>
          </InnerWrapper>
          <Sidebar />
        </div>
      </Layout>
    </div>
  );
}

export default DashboardSass;
