import React, { useState } from "react";
import GalleryCard from "../cards/GalleryCard";
import LightBox from "./LightBox";

function GalleryCom({ images }) {
  const [openImg, setOpenImg] = useState(false);
  return (
    <div className="row">
      {images.map((image, index) => (
        <GalleryCard
          image={image.img}
          openImg={setOpenImg}
          id={index + 1}
          className={image.width}
          key={index + "img"}
        />
      ))}
      {openImg && (
        <LightBox
          key={index + "img"}
          images={images.map((image) => image.img)}
          activeImg={openImg}
          close={() => setOpenImg(false)}
        />
      )}
    </div>
  );
}

export default GalleryCom;
