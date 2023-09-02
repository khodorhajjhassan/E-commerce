import React from "react";
import { Link } from "react-router-dom";

const Category = () => {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 md:w-4/5 w-11/12 m-auto my-10 ">
        <div className="relative rounded">
          <img
            src="https://www.theathletesfoot.com.au/media/wysiwyg/ZacWork/Walk_Hub_Dark_2022.jpg"
            alt=""
            className="w-full h-full rounded"
          />
          <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-white text-4xl font-bold">WOMEN</h2>
            <Link to="product/search?q=women">
              <button className="p-2 border-2 hover:bg-gray-700 duration-300 text-white font-bold my-5">
                SHOP NOW
              </button>
            </Link>
          </div>
        </div>
        <div
          className="relative w-full h-auto rounded"
          style={{ height: "300px" }}
        >
          <img
            src="https://www.theathletesfoot.com.au/media/wysiwyg/ZacWork/School_Hub_Dark_2022.jpg"
            alt=""
            className="w-full h-full rounded"
          />
          <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-white text-4xl font-bold">KIDS</h2>
            <Link to="product/search?q=kids">
              <button className="p-2 border-2 hover:bg-gray-700 duration-300 text-white font-bold my-5">
                SHOP NOW
              </button>
            </Link>
          </div>
        </div>
        <div
          className="relative w-full h-auto rounded"
          style={{ height: "300px" }}
        >
          <img
            src="https://www.theathletesfoot.com.au/media/wysiwyg/ZacWork/Work_Hub_Dark_2022.jpg"
            alt=""
            className="w-full h-full rounded "
          />
          <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
            <h2 className="text-white text-4xl font-bold">MEN</h2>
            <Link to="product/search?q=oxford">
              <button className="p-2 border-2 hover:bg-gray-700 duration-300 text-white font-bold my-5">
                SHOP NOW
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
