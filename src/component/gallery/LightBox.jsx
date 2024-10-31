import React, { useState } from "react";

function LightBox({ images, activeImg, close }) {
  const [activeSlide, setActiveSlide] = useState(activeImg);
  // button click event
  const handleSlide = (change) => {
    if (change === "next" && activeSlide < images.length) {
      setActiveSlide(activeSlide + 1);
    } else if (change === "next" && activeSlide === images.length) {
      setActiveSlide(1);
    } else if (change === "prev" && activeSlide > 1) {
      setActiveSlide(activeSlide - 1);
    } else if (change === "prev" && activeSlide === 1) {
      setActiveSlide(images.length);
    }
  };
  // mouse WheelEvent
  function handleWheel(event) {
    // Detect the direction of the mouse scroll
    if (event.deltaY > 0) {
      if (activeSlide > 1) {
        setActiveSlide(activeSlide - 1);
      } else if (activeSlide === 1) {
        setActiveSlide(images.length);
      }
    } else {
      if (activeSlide < images.length) {
        setActiveSlide(activeSlide + 1);
      } else if (activeSlide === images.length) {
        setActiveSlide(1);
      }
    }
  }

  // swiper event

  const [startX, setStartX] = useState(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    setStartX(null);

    if (deltaX > 0) {
      if (activeSlide > 1) {
        setActiveSlide(activeSlide - 1);
      } else if (activeSlide === 1) {
        setActiveSlide(images.length);
      }
    } else if (deltaX < 0) {
      if (activeSlide < images.length) {
        setActiveSlide(activeSlide + 1);
      } else if (activeSlide === images.length) {
        setActiveSlide(1);
      }
    }
  };

  // DragEvent

  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(null);
  const [moveSide, setMoveSide] = useState(null);

  const handleMouseDown = (e) => {
    setDragX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const deltaX = currentX - dragX;
    if (deltaX !== 0) {
      // Determine the direction
      const direction = deltaX > 0 ? "right" : "left";
      setMoveSide(direction);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartX(null);
    if (moveSide === "right") {
      if (activeSlide > 1) {
        setActiveSlide(activeSlide - 1);
      } else if (activeSlide === 1) {
        setActiveSlide(images.length);
      }
    } else if (moveSide === "left") {
      if (activeSlide < images.length) {
        setActiveSlide(activeSlide + 1);
      } else if (activeSlide === images.length) {
        setActiveSlide(1);
      }
    }
    setMoveSide(false);
  };
  return (
    <div
      className={`lightBox-wrapper ${activeImg ? "" : "lightBox-deActive"}`}
      onWheel={(e) => handleWheel(e)}
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchEnd={(e) => handleTouchEnd(e)}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseUp={(e) => handleMouseUp(e)}
    >
      <div className="lightBox">
        <div className="closeLightBox" onClick={close}>
          <svg
            className="LBCloseButton"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="11 11 30 30"
          >
            <path
              className="LBCloseButton"
              d="M27.92 25l8.84-8.84 1.82-1.82c.27-.27.27-.71 0-.97l-1.95-1.95a.682.682 0 0 0-.97 0L25 22.08 14.34 11.42a.682.682 0 0 0-.97 0l-1.95 1.95c-.27.27-.27.71 0 .97L22.08 25 11.42 35.66c-.27.27-.27.71 0 .97l1.95 1.95c.27.27.71.27.97 0L25 27.92l8.84 8.84 1.82 1.82c.27.27.71.27.97 0l1.95-1.95c.27-.27.27-.71 0-.97L27.92 25z"
            ></path>
          </svg>
        </div>

        <div
          className="lightBox-arrow lightBox-arrow-left"
          onClick={() => handleSlide("prev")}
        >
          <svg
            className="lightBoxSlide-Button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="11 11 30 30"
          >
            <path
              className="lightBoxSlide-Button"
              d="M25.47 38.64l.44-.44c.29-.29.29-.76 0-1.05L14.82 26.06h23.35c.41 0 .75-.33.75-.75v-.62c0-.41-.33-.75-.75-.75H14.82l11.09-11.09c.29-.29.29-.76 0-1.05l-.44-.44a.742.742 0 0 0-1.05 0L11.31 24.47c-.29.29-.29.76 0 1.05l13.11 13.11c.29.3.76.3 1.05.01z"
            ></path>
          </svg>
        </div>
        <div
          className="lightBox-arrow lightBox-arrow-right"
          onClick={() => handleSlide("next")}
        >
          <svg
            className="lightBoxSlide-Button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="11 11 30 30"
          >
            <path
              className="lightBoxSlide-Button"
              d="M24.53 11.36l-.44.44c-.29.29-.29.76 0 1.05l11.09 11.09H11.83c-.41 0-.75.33-.75.75v.62c0 .41.33.75.75.75h23.35L24.09 37.14c-.29.29-.29.76 0 1.05l.44.44c.29.29.76.29 1.05 0l13.11-13.11c.29-.29.29-.76 0-1.05l-13.1-13.11a.754.754 0 0 0-1.06 0z"
            ></path>
          </svg>
        </div>

        <div className="lightBox-slider">
          {images.map((img, index) => (
            <img
              className={`lightBox-img ${
                index + 1 === activeSlide && "lightBox-img-active"
              }`}
              key={img}
              src={img}
              alt=""
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LightBox;
