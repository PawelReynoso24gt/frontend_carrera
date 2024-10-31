import React from "react";
import { Link } from "react-router-dom";
import userImg from "../../assets/img/user-3.png";
import authorImg from "../../assets/img/author-1.png";
import authorImg2 from "../../assets/img/author-2.png";
import authorImg3 from "../../assets/img/author-3.png";
import savedIcon from "../../assets/img/saved-icon.svg";
import shareIcon from "../../assets/img/share-icon.svg";
import fileIcon from "../../assets/img/file-icon.svg";
import downloadIcon from "../../assets/img/download-icon.svg";
import hireAgent from "../../assets/img/hire-agent.png";

function Sidebar3() {
  return (
    <div className="col-lg-3 col-12">
      {/* <!-- Featured User --> */}
      <div className="crancy-featured-user mg-top-70">
        {/* <!-- User Head --> */}
        <div className="crancy-featured-user__head">
          <img src={userImg} />
          <h4 className="crancy-featured-user__title">Courtney Henry</h4>
          <p className="crancy-featured-user__text">
            Finance managers • Jakarta, Indonesia• 2 days ago
          </p>
        </div>
        {/* <!-- Total User --> */}
        <div className="crancy-tasksingle__group crancy-tasksingle__group--activity crancy-featured-user__lists mg-top-10">
          <Link to="#">
            <img src={authorImg} alt="author-img" />
          </Link>
          <Link to="#">
            <img src={authorImg2} alt="author-img" />
          </Link>
          <Link to="#">
            <img src={authorImg3} alt="author-img" />
          </Link>
          <Link to="#">
            <span>+5</span>
          </Link>
          <b className="crancy-featured-user__more">Five friends work here</b>
        </div>
        <div className="crancy-featured-user__btn-group">
          <Link to="#">
            <img src={savedIcon} />
          </Link>
          <Link to="#">
            <img src={shareIcon} />
          </Link>
        </div>
        {/* <!-- User Info List --> */}
        <ul className="crancy-featured-user__list crancy-featured-user__border">
          <li>
            Experience <Link to="#">2-4 Years</Link>
          </li>
          <li>
            Seniority Level <Link to="#">Senior Level</Link>
          </li>
          <li>
            Employment <Link to="#">Full Time</Link>
          </li>
          <li>
            Salary <Link to="#">$250-300</Link>
          </li>
        </ul>
        {/* <!-- User File List --> */}
        <div className="crancy-featured-user__files crancy-featured-user__border">
          <h4 className="crancy-featured-user__title--small">Files</h4>
          <a to="#">
            <div className="crancy-featured-user__fcontent">
              <span className="crancy-featured-user__ficon">
                <img src={fileIcon} />
              </span>
              <h4 className="crancy-featured-user__fname">
                Overview.pdf
                <span className="crancy-featured-user__fsize">50 Kb</span>
              </h4>
            </div>
            <div className="crancy-featured-user__fdownload">
              <img src={downloadIcon} />
            </div>
          </a>
          <a to="#" className="mg-top-20">
            <div className="crancy-featured-user__fcontent">
              <span className="crancy-featured-user__ficon">
                <img src={fileIcon} />
              </span>
              <h4 className="crancy-featured-user__fname">
                Overview.pdf
                <span className="crancy-featured-user__fsize">50 Kb</span>
              </h4>
            </div>
            <div className="crancy-featured-user__fdownload">
              <img src={downloadIcon} />
            </div>
          </a>
        </div>
        {/* <!-- User Hire Agent --> */}
        <div className="crancy-featured-user__hagent crancy-featured-user__border">
          <h4 className="crancy-featured-user__title--small">Hiring Agent</h4>
          <div className="crancy-featured-user__hcard">
            <img src={hireAgent} alt="" />
            <div className="crancy-featured-user__hcontent">
              <h4 className="crancy-featured-user__hagent--title">
                Annette Black
                <span>
                  <b>HR Specialist</b> • 4 Yrs Exp
                </span>
              </h4>
            </div>
          </div>
          <div className="crancy-featured-user__button mg-top-25">
            <Link to="/inbox" className="crancy-btn crancy-featured-user__btn">
              Add a contact
            </Link>
          </div>
        </div>
      </div>
      {/* <!-- End Featured User --> */}
    </div>
  );
}

export default Sidebar3;
