const Slider = () => {
  return (
    <div className="flex  justify-center h-screen">
      <div className="carousel transition-all duration-1000 ease-linear w-full h-[65%] ">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="shoe1.png"
            alt="Slide 1"
            className="object-contain w-full" // Adjusted class here
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        {/* Add alt prop for each <img> element */}
        <div id="slide2" className="carousel-item relative  w-full">
          <img
            src="shoe2.jpg"
            alt="Slide 2"
            className="object-contain w-full" // Adjusted class here
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        {/* Add alt prop for each <img> element */}
        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="shoe3.jpg"
            alt="Slide 3"
            className="object-contain w-full" // Adjusted class here
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        {/* Add alt prop for each <img> element */}
        <div id="slide4" className="carousel-item relative w-full">
          <img
            src="shoe4.jpg"
            alt="Slide 4"
            className="object-contain w-full" // Adjusted class here
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
