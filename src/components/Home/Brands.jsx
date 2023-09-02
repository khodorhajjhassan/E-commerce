import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./style.css";

const Brands = () => {
  const brand = [
    {
      id: 1,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/nike.svg",
      href:"/product/search?q=Nike" 
    },
    {
      id: 2,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/adidas_update.svg",
      href:"/product/search?q=adidas" 

    },
    {
      id: 3,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/converse.svg",
      href:"/product/search?q=converse" 

    },
    {
      id: 4,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/newbalance.svg",
      href:"/product/search?q=newbalance" 

    },
    {
      id: 5,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/puma.svg",
      href:"/product/search?q=puma" 

    },
    {
      id: 6,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/crocs.svg",
      href:"/product/search?q=crocs" 

    },
    {
      id: 7,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/skechers.svg",
      href:"/product/search?q=skechers" 

    },
    {
      id: 8,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/vans.svg",
      href:"/product/search?q=vans" 

    },
    {
      id: 9,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/dr-martens.svg",
      href:"/product/search?q=martens" 

    },
    {
      id: 10,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/birkenstock.svg",
      href:"/product/search?q=birkenstock" 

    },

    {
      id: 12,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/brand-logos/asics.svg",
      href:"/product/search?q=asics" 

    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
        <h2 className="text-center text-3xl text-gray-800 font-bold mb-10">
          Top Brands
        </h2>
        <Slider {...settings}>
          {brand.map((val) => (
            <div key={val.id}>
              <a href={val.href}>
              <img src={val.img} alt="" />
              </a>
            </div>
          ))}
        </Slider>
      </div>
      <div className="flex md:flex-row flex-col md:gap-0 gap-2 m-10 py-10 md:w-3/5 w-4/5 m-auto bg-white">
        <div className="flex flex-col gap-4">
          <img
            src="https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/bts/2-story/wk25_071723_2_story_right_converse_1.jpg"
            alt=""
          />
          <h2 className="text-center text-gray-700 font-bold text-2xl">
            Style of the Week
          </h2>
          <p className="text-center text-gray-500">
            Just in! We’re loving this new color of the top-selling lightweight
            platform Converse.
          </p>
          <a href="/product/search?q=converse" className="m-auto">
          <button className="w-auto m-auto font-bold p-2 md:text-l h-10 bg-gray-700 text-white duration-300 hover:bg-gray-800">
            Shop converse chuck taylor all star move
          </button>
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <img
            src="https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/bts/2-story/wk13_042423_2_story_right_distort_birkenstock.jpg"
            alt=""
          />
          <h2 className="text-center text-gray-700 font-bold text-2xl">
            Back in Stock
          </h2>
          <p className="text-center text-gray-500">
            Grab the iconic Birkenstock Boston clog before it sells out (again!)
          </p>
          <a href="/product/search?q=running" className="m-auto">
          <button className="w-auto m-auto font-bold p-2 md:text-l h-10 bg-gray-700 text-white duration-300 hover:bg-gray-800">
            Shop birkenstock boston
          </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Brands;
