import React from "react";
import SelectInput from "../form/SelectInput";
import afghanistan from "../../assets/img/country-1.png";
import saudiArabia from "../../assets/img/country-5.png";
import bangladesh from "../../assets/img/country-2.png";
import unitedStates from "../../assets/img/country-4.png";

function Countries() {
  return (
    <div className="col-xl-12 col-lg-6 col-md-6 col-12 crancy-sidebar__widget">
      <div className="crancy-sidebar__single">
        {/* <!-- Sidebar Heading --> */}
        <div className="crancy-sidebar__heading">
          <h4 className="crancy-sidebar__title">Countries</h4>

          <SelectInput
            options={[
              "View All",
              "Last 7 Days",
              "Last 15 Days",
              "Last 30 Days",
            ]}
          />
        </div>

        {/* <!-- Sidebar Creator Lists --> */}
        <div className="crancy-sidebar__creators">
          <div className="tab-content" id="nav-tabContent">
            {/* <!-- Single Tab --> */}
            <div
              className="tab-pane fade show active"
              id="seller_tab-1"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              <ul className="crancy-sidebar__creatorlist">
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={afghanistan} alt="#" />
                    <a href="#">
                      <span className="crancy-sidebar__creator-link">
                        Afghanistan
                      </span>
                      <b className="crancy-sidebar__creator-name">$7.34k</b>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={saudiArabia} alt="#" />
                    <a href="#">
                      <span className="crancy-sidebar__creator-link">
                        Saudi Arabia
                      </span>
                      <b className="crancy-sidebar__creator-name">$5.34k</b>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={bangladesh} alt="#" />
                    <a href="#">
                      <span className="crancy-sidebar__creator-link">
                        Bangladesh
                      </span>
                      <b className="crancy-sidebar__creator-name">$3.34k</b>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={unitedStates} alt="#" />
                    <a href="#">
                      <span className="crancy-sidebar__creator-link">
                        United States
                      </span>
                      <b className="crancy-sidebar__creator-name">$3.34k</b>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={saudiArabia} alt="#" />
                    <a href="#">
                      <span className="crancy-sidebar__creator-link">
                        Ireland
                      </span>
                      <b className="crancy-sidebar__creator-name">$8.34k</b>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            {/* <!-- Single Tab --> */}
          </div>
        </div>
        {/* <!-- End Sidebar Creator Lists --> */}
      </div>
    </div>
  );
}

export default Countries;
