import React from "react";
import SelectInput from "../form/SelectInput";
import seller1 from "../../assets/img/seller-1.png";
import seller2 from "../../assets/img/seller-2.png";
import seller3 from "../../assets/img/seller-3.png";
import seller4 from "../../assets/img/seller-4.png";
import seller5 from "../../assets/img/seller-5.png";

function TopSeller() {
  return (
    <div className="col-xl-12 col-lg-6 col-md-6 col-12 crancy-sidebar__widget">
      {/* <!-- crancy Single Sidebar --> */}
      <div className="crancy-sidebar__single">
        {/* <!-- Sidebar Heading --> */}
        <div className="crancy-sidebar__heading">
          <h4 className="crancy-sidebar__title">Top Seller</h4>
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
              id="seller_tab-3"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              <ul className="crancy-sidebar__creatorlist crancy-sidebar__creatorlist--sellers">
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={seller1} alt="#" />
                    <a href="#">
                      <b className="crancy-sidebar__creator-name">
                        Eleanor Pena
                      </b>
                      <span className="crancy-sidebar__creator-badge crancy-color1">
                        13k
                      </span>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={seller2} alt="#" />
                    <a href="#">
                      <b className="crancy-sidebar__creator-name">
                        Kathryn Murphy
                      </b>
                      <span className="crancy-sidebar__creator-badge crancy-color1">
                        20K
                      </span>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={seller3} alt="#" />
                    <a href="#">
                      <b className="crancy-sidebar__creator-name">
                        Cody Fisher
                      </b>
                      <span className="crancy-sidebar__creator-badge crancy-color1">
                        33K
                      </span>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={seller4} alt="#" />
                    <a href="#">
                      <b className="crancy-sidebar__creator-name">
                        Darlene Robertson
                      </b>
                      <span className="crancy-sidebar__creator-badge crancy-color1">
                        10K
                      </span>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="crancy-sidebar__creator">
                    <img src={seller5} alt="#" />
                    <a href="#">
                      <b className="crancy-sidebar__creator-name">
                        Ronald Richards
                      </b>
                      <span className="crancy-sidebar__creator-badge crancy-color1">
                        35K
                      </span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* <!-- End Sidebar Creator Lists --> */}
      </div>
      {/* End crancy Single Sidebar */}
    </div>
  );
}

export default TopSeller;
