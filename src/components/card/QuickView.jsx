import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";

const QuickView = ({ product }) => {
  const [click, setClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Set initial isLoading state to false

  const toggleQuickView = () => {
    setClick(!click);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div>
      <button
        onClick={toggleQuickView}
        className="md:p-2 p-1 rounded md:text-sm text-[10px] bg-gray-700 md:font-bold font-normal text-white flex items-center hover:bg-gray-900 duration-300"
      >
        <img src="/search.svg" className="w-6" alt="" />
        Quick View
      </button>
      <div
        className={`fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-gray-500 bg-opacity-50 bordered opacity-0 z-50 duration-300 ${
          click ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <TailSpin color="#007BFF" size={40} />
          </div>
        ) : product.length === 0 ? (
          <div className="text-center text-xl">No products found.</div>
        ) : (
          <div className="md:w-6/12 w-11/12 h-auto shadow-xl bg-white m-auto rounded p-4 z-50">
            <div className="md:flex block gap-4">
              <div className="md:w-4/12 w-60 m-auto h-auto md:border-r-2">
                <img
                  src={product.productimg[1]}
                  className="w-full h-full"
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-4 w-8/12">
                <p className="text-lg font-bold text-gray-500">
                  {product.producer}
                </p>
                <h2 className="text-2xl font-bold text-gray-700">
                  {product.name}
                </h2>
                <p>
                  <span className="text-2xl font-bold text-gray-700">
                    {!product.discount === 0
                      ? (
                          product.price -
                          (product.discount / 100) * product.price
                        ).toFixed(2)
                      : product.price + "$"}
                  </span>
                  <span className="text-sm text-gray-700 line-through">
                    {!product.discount === 0 ? product.price + "$" : ""}
                  </span>
                </p>
                <p className="font-bold md:text-2xl text-xl">Description:</p>
                <p className="md:text-normal text-sm">{product.description}</p>
              </div>
            </div>
            <div className="text-right my-5">
              <Link to={`/productdetails/${product._id}`}>
                <button className="border-2 rounded bg-gray-700 text-white p-3 text-gray-500 hover:bg-gray-900 duration-300">
                  More Information
                </button>
              </Link>
              <button
                className="border-2 rounded bg-red-700 text-white p-3 text-gray-500 hover:bg-red-900 duration-300"
                onClick={() => setClick(false)}
              >
                {" "}
                Cancel
              </button>
            </div>
          </div>
        )}
        <div
          onClick={() => setClick(false)}
          className="p-3 font-bold rounded border-2 text-white bg-gray-700 hover:bg-gray-900 duration-300 cursor-pointer absolute top-5 right-5"
        >
          X
        </div>
      </div>
    </div>
  );
};

export default QuickView;
