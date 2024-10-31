import React from "react";
import usdIcon from "../../assets/img/usd-icon.png";

function SingleOrder({ order }) {
  const { id, img, title, date, author, price, paymentMethod, paymentStatus } =
    order;
  return (
    <tr>
      <td className="crancy-table__column-1 crancy-table__data-1">
        <div className="crancy-table__product--id">
          <p className="crany-table__product--number">
            <a href="#">{id}</a>
          </p>
        </div>
      </td>
      <td className="crancy-table__column-2 crancy-table__data-2">
        <div className="crancy-table__product">
          <div className="crancy-table__product-img">
            <img src={img} alt="#" />
          </div>
          <div className="crancy-table__product-content">
            <h4 className="crancy-table__product-title">{title}</h4>
          </div>
        </div>
      </td>
      <td className="crancy-table__column-3 crancy-table__data-3">
        <p className="crancy-table__text crancy-table__time">{date}</p>
      </td>
      <td className="crancy-table__column-4 crancy-table__data-4">
        <h5 className="crancy-table__inner--title">{author}</h5>
      </td>
      <td className="crancy-table__column-5 crancy-table__data-5">
        <div className="crancy-table__amount crancy-table__text-two">
          <img src={usdIcon} alt="#" />
          <span className="crancy-table__text">{price}</span>
        </div>
      </td>
      <td className="crancy-table__column-6 crancy-table__data-6">
        <h5 className="crancy-table__inner--title">{paymentMethod}</h5>
      </td>
      <td className="crancy-table__column-7 crancy-table__data-7">
        <div
          className={`crancy-table__status ${
            paymentStatus.toLowerCase() === "pending"
              ? "crancy-table__status--pending"
              : paymentStatus.toLowerCase() === "cancel"
              ? "crancy-table__status--cancel"
              : ""
          }`}
        >
          {paymentStatus}
        </div>
      </td>
    </tr>
  );
}

export default SingleOrder;
