import React from "react";
import Slider from "react-slick";

const Hero = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  return (
    <div className="">
      <Slider {...settings}>
        <div className="w-screen h-auto">
          <img
            src="/welcom.png"
            alt="footVibe"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full h-auto bg-green-500 border-2">
          <img
            src="https://www.theathletesfoot.com.au/media/wysiwyg/Dua/TAF_Saucony_Web_1920x650.gif"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full  bg-blue-500 border-2">
          <img
            src="https://www.theathletesfoot.com.au/media/wysiwyg/campaign/Fathers_day_23/TAF_Fathers_Day_Web_1920x650.jpg"
            alt=""
            className="w-full h-full "
          />
        </div>
      </Slider>
    </div>
  );
};

export default Hero;
