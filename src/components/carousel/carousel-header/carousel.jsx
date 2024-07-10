import React from "react";
import { Carousel } from "flowbite-react";
import carouselMain from "../../../assets/carousel/Main.png";
import carousel1 from "../../../assets/carousel/Black-Yellow.png";
import carousel2 from "../../../assets/carousel/Black-White.png";

const CarouselHeader = () => {
  return (
    <div className="lg:ml-14 flex justify-center">
      <div className="h-96 w-full sm:h-112 xl:h-128 2xl:h-144">
        <Carousel>
          <img
            className="w-fit h-full object-fill"
            src={carouselMain}
            alt="..."
            to={``}
          />
          <img
            className="w-fit h-full object-fill"
            src={carousel1}
            alt="..."
            to={``}
          />
          <img
            className="w-fit h-full object-fill"
            src={carousel2}
            alt="..."
            to={``}
          />
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselHeader;
