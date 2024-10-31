import React, { useEffect, useState } from "react";
import SelectInput from "../form/SelectInput";
import { productActivity } from "../../data/productActivity";
import ProductInfo from "../cards/ProductInfo";
import calenderIcon from "../../assets/img/calendar-icon.svg";
import SelectBox from "../form/SelectBox";

function ProductActivity() {
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(4);

  return (
    <div className="crancy-table mg-top-30">
      <div className="crancy-table__heading">
        <h3 className="crancy-table__title mb-0">Prodcuts Activity</h3>
        <SelectInput
          options={[" Last 7 Days", " Last 15 Days", "Last Month"]}
        />
      </div>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="table_1"
          role="tabpanel"
          aria-labelledby="table_1"
        >
          {/* <!-- Table Filter --> */}
          <div className="crancy-table-filter mg-btm-20">
            <div className="row">
              <div className="col-lg-3 col-md-6 col-12">
                {/* <!-- Single Filter --> */}
                <div className="crancy-table-filter__single crancy-table-filter__location">
                  <label htmlFor="crancy-table-filter__label">Location</label>
                  <SelectBox
                    datas={[
                      "State or Province",
                      "New York",
                      "Sydney",
                      "Dhaka",
                      "Victoria",
                    ]}
                    img={<i className="fa-solid fa-chevron-down"></i>}
                  />
                </div>
                {/* <!-- End Single Filter --> */}
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                {/* <!-- Single Filter --> */}
                <div className="crancy-table-filter__single crancy-table-filter__amount">
                  <label htmlFor="crancy-table-filter__label">
                    Amount Spent
                  </label>
                  <SelectBox
                    datas={["$2,000", "$4,000", "$3,000", "$4,000", "$5,000"]}
                    img={<i className="fa-solid fa-chevron-down"></i>}
                  />
                </div>
                {/* <!-- End Single Filter --> */}
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                {/* <!-- Single Filter --> */}
                <div className="crancy-table-filter__single crancy-table-filter__trans-date">
                  <label htmlFor="crancy-table-filter__label">
                    Transaction list Date
                  </label>
                  <div className="crancy-table-filter__group">
                    <input
                      type="text"
                      id="dateInput"
                      placeholder="Select date"
                    />
                    <span className="crancy-table-filter__icon">
                      <img src={calenderIcon} />
                    </span>
                  </div>
                </div>
                {/* <!-- End Single Filter --> */}
              </div>
              <div className="col-lg-3 col-md-6 col-12">
                {/* <!-- Single Filter --> */}
                <div className="crancy-table-filter__single crancy-table-filter__trans">
                  <label htmlFor="crancy-table-filter__label">
                    Type of transaction
                  </label>
                  <SelectBox
                    datas={["All transaction", "Paypal", "Stripe", "Payoneer"]}
                    img={<i className="fa-solid fa-chevron-down"></i>}
                  />
                </div>
                {/* <!-- End Single Filter --> */}
              </div>
            </div>
          </div>
          {/* <!-- End Table Filter --> */}
          {/* <!-- crancy Table --> */}
          <table
            id="crancy-table__main"
            className="crancy-table__main crancy-table__main-v2"
          >
            {/* <!-- crancy Table Head --> */}
            <thead className="crancy-table__head">
              <tr>
                <th className="crancy-table__column-1 crancy-table__h1">
                  Page Link
                </th>
                <th className="crancy-table__column-2 crancy-table__h2">
                  Impression
                </th>
                <th className="crancy-table__column-3 crancy-table__h3">
                  Click
                </th>
                <th className="crancy-table__column-4 crancy-table__h4">
                  Conversation
                </th>
                <th className="crancy-table__column-5 crancy-table__h5">
                  Status
                </th>
                <th className="crancy-table__column-6 crancy-table__h6">
                  Visitor
                </th>
              </tr>
            </thead>
            {/* <!-- crancy Table Body --> */}
            <tbody className="crancy-table__body">
              {productActivity?.map((product, index) => {
                const current = page * show;
                const previous = current - show;
                if (
                  previous > 0 &&
                  index + 1 > previous &&
                  index + 1 <= current
                ) {
                  return <ProductInfo product={product} key={product.id} />;
                } else if (page == 1) {
                  return (
                    index < page * show && (
                      <ProductInfo product={product} key={product.id} />
                    )
                  );
                }
              })}
            </tbody>
            {/* <!-- End crancy Table Body --> */}
          </table>
          <div className="crancy-table-bottom">
            <div id="crancy-table__main_filter" className="dataTables_filter">
              <label>
                Search:
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder=""
                  aria-controls="crancy-table__main"
                />
              </label>
            </div>
            <div className="dataTables_length" id="crancy-table__main_length">
              <label>
                Show result:
                <select
                  name="crancy-table__main_length"
                  aria-controls="crancy-table__main"
                  className="form-select form-select-sm"
                  onChange={(e) => setShow(e.target.value)}
                  defaultValue={4}
                >
                  <option value="4">4</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </label>
            </div>
            <div
              className="dataTables_paginate paging_simple_numbers"
              id="crancy-table__main_paginate"
            >
              <ul className="pagination">
                <li
                  className={`paginate_button page-item previous ${
                    page === 1 ? "disabled" : ""
                  }`}
                  id="crancy-table__main_previous"
                  onClick={() => page > 1 && setPage(page - 1)}
                >
                  <a
                    aria-controls="crancy-table__main"
                    data-dt-idx="previous"
                    tabIndex="0"
                    className="page-link"
                  >
                    <i className="fas fa-angle-left"></i>
                  </a>
                </li>
                {Array.from(
                  Array(Math.ceil(productActivity.length / show)).keys("n")
                ).map((id, index) => (
                  <li
                    className={`paginate_button page-item ${
                      page === index + 1 ? "active" : ""
                    }`}
                    onClick={() => setPage(index + 1)}
                    key={index + "key"}
                  >
                    <a
                      aria-controls="crancy-table__main"
                      data-dt-idx="0"
                      tabIndex="0"
                      className="page-link"
                    >
                      {index + 1}
                    </a>
                  </li>
                ))}
                <li
                  className={`paginate_button page-item next ${
                    page === productActivity.length % show < 1 ? "disabled" : ""
                  }`}
                  id="crancy-table__main_next"
                  onClick={() =>
                    page < Math.ceil(productActivity.length / show) &&
                    setPage(page + 1)
                  }
                >
                  <a
                    aria-controls="crancy-table__main"
                    data-dt-idx="next"
                    tabIndex="0"
                    className="page-link"
                  >
                    <i className="fas fa-angle-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* <!-- End crancy Table --> */}
        </div>
      </div>
    </div>
  );
}

export default ProductActivity;
