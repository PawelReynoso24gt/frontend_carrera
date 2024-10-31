import React, { useEffect, useState } from "react";
import Layout from "../../component/home-two/Layout";
import BreadCrumb from "../../component/home-two/BreadCrumb";
import Wrapper from "../../component/gallery/Wrapper";
import { images, images2 } from "../../data/images";
import Heading from "../../component/gallery/Heading";
import GalleryCom from "../../component/gallery/GalleryCom";
import useMenu from "../../hooks/useMenu";

function Gallery() {
  useMenu();
  const [activeGallery, setActiveGallery] = useState(1);
  const [imagesG, setImages] = useState(images);
  useEffect(() => {
    setImages(imagesG === images ? images2 : images);
  }, [activeGallery]);
  return (
    <Layout>
      <BreadCrumb title="Gallery" link="/gallery" />
      <Wrapper>
        <Heading
          activeGallery={activeGallery}
          setActiveGallery={setActiveGallery}
        />
        <GalleryCom images={imagesG} />
      </Wrapper>
    </Layout>
  );
}

export default Gallery;
