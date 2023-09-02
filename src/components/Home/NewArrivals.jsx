import axios from "axios";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = "http://localhost:8000/shoe/allproducts";

    // Make the Axios GET request to fetch the data
    axios
      .get(apiUrl)
      .then((response) => {
        // Get the last 4 products from the response data
        const last4Products = response.data.slice(-8);
        setProducts(last4Products);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024, // Medium devices and above
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768, // Small devices
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480, // Extra small devices
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="bg-white">
      <div className="bg-white py-10 w-4/5 m-auto">
        <h2 className="text-center text-3xl text-gray-800 font-bold mb-20">
          New Arrival
        </h2>
        <Slider {...sliderSettings}>
          {" "}
          {/* Wrap the mapping inside the Slider component */}
          {products.map((val) => (
            <a
              href={`/product/search?q=${val.name}`}
              key={val._id}
              className="text-center text-gray-700 font-bold flex flex-col items-center"
            >
              <div className="h-auto">
                <img
                  src={val.productimg[1]}
                  alt=""
                  className="h-56 w-64 object-contain"
                />
              </div>
              <span className="text-rose-400 mt-2">NEW</span>
              <h2>{val.producer}</h2>
              <p className="text-gray-500 font-normal">{val.name}</p>
              <span>
                {!val.discount === 0
                  ? (val.price - (val.discount / 100) * val.price).toFixed(2)
                  : val.price}
                $
              </span>
            </a>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewArrivals;
