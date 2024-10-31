import React from "react";

function Heading({ activeGallery, setActiveGallery }) {
  return (
    <>
      <div className="row">
        <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
          <div className="crancy-section-title mg-btm-20">
            <h3 className="crancy-section__title">Our Gallery</h3>
            <p className="crancy-section__text">
              Contrary to popular belief, orem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
            </p>
          </div>
        </div>
      </div>
      {/* <!-- Gallery Nav --> */}
      <div className="crancy-pcats__bar crancy-pcats__bar--v2">
        <div
          className="crancy-pcats__list list-group "
          id="list-tab"
          role="tablist"
        >
          <a
            className={`list-group-item ${activeGallery === 1 ? "active" : ""}`}
            onClick={() => setActiveGallery(1)}
          >
            Gallery 1
          </a>
          <a
            className={`list-group-item ${activeGallery === 2 ? "active" : ""}`}
            onClick={() => setActiveGallery(2)}
          >
            Gallery 2
          </a>
          <a
            className={`list-group-item ${activeGallery === 3 ? "active" : ""}`}
            onClick={() => setActiveGallery(3)}
          >
            Gallery 3
          </a>
          <a
            className={`list-group-item ${activeGallery === 4 ? "active" : ""}`}
            onClick={() => setActiveGallery(4)}
          >
            Gallery 4
          </a>
          <a
            className={`list-group-item ${activeGallery === 5 ? "active" : ""}`}
            onClick={() => setActiveGallery(5)}
          >
            Gallery 5
          </a>
          <a
            className={`list-group-item ${activeGallery === 6 ? "active" : ""}`}
            onClick={() => setActiveGallery(6)}
          >
            Gallery 6
          </a>
        </div>
      </div>
    </>
  );
}

export default Heading;
