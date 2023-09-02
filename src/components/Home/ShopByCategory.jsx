import React from "react";
import { Link } from "react-router-dom";

const ShopByCategory = () => {
  const category = [
    {
      id: 1,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/bts/categories/wk25_071723_categorybanner_1_new_arrivals.jpg",
      title: "New Arrivals",
      cat: "women",
    },
    {
      id: 2,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/bts/categories/wk25_071723_categorybanner_2_slipons.jpg",
      title: "Slip On Shoes",
      cat: "slip",
    },
    {
      id: 3,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/bts/categories/wk25_071723_categorybanner_3_footbeds.jpg",
      title: "Footbed Sandals",
      cat: "sandal",
    },
    {
      id: 4,
      img: "https://www.famousfootwear.com/-/media/project/tenant/famous-footwear/famous-footwear/homepage/2023/bts/categories/wk25_071723_categorybanner_4_running.jpg",
      title: "Running Shoes",
      cat: "running",
    },
  ];
  return (
    <div className="bg-white ">
      <div className="bg-white py-10 w-4/5 m-auto">
        <h2 className="text-center text-3xl text-gray-800 font-bold">
          Shop By Category
        </h2>

        <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
          {category.map((val) => {
            return (
              <Link to={`/product/search?q=${val.cat}`}>
                <div
                  className="text-center text-gray-700 font-bold"
                  key={val.id}
                >
                  <img src={val.img} alt="" className="mb-2" />
                  <h2>{val.title}</h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
