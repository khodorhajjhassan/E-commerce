import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeProductFromCompare } from "../../redux/compareSlice";

const CompareProducts = () => {
  const compareProducts = useSelector((state) => state.user.compare);
  const items = compareProducts.products.length;

  const dispatch = useDispatch();

  const handleClick = (product) => {
    dispatch(removeProductFromCompare(product));
  };

  return (
    <div className="w-4/5 m-auto my-10">
      <h1 className="text-3xl mb-5 font-bold">Compare Product</h1>
      <p className="text-2xl mb-5 tracking-tight leading-6 text-gray-600">
        {items} items
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compareProducts.products.map((product) => (
          <div key={product._id} className="border rounded p-4">
            <img
              src={product.productimg[1]}
              className="w-44 h-44 m-auto mb-4 object-contain"
              alt=""
            />
            <p className="md:text-xl text-base mb-2 font-bold">
              {product.name}
            </p>
            <p className="text-hrey-500  py-2">
              <span className="text-gray-700 mb-2 font-bold">Brand:</span>{" "}
              {product.producer}
            </p>

            <p className="text-gray-700 mb-2 font-bold py-2">Colors:</p>
            <div className="flex mb-2">
              {product.color.map((color, index) => (
                <div>
                  <span
                    key={index}
                    className={`inline-block w-5 h-5 rounded-full border-2 border-gray-300 mx-1`}
                    style={{ background: color.colorName }}
                  ></span>
                </div>
              ))}
            </div>

            <p className="text-gray-500 mb-2 py-2">
              <span className="text-gray-700 mb-2 font-bold">Price:</span>{" "}
              {product.price}$
            </p>
            {/* <div className="mb-2">
              <p className="text-gray-500 py-2"><span className='text-gray-700 mb-2 font-bold'>Rating:</span></p>
              <div className="flex gap-2">
                <ul className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <li key={star}>
                      <img
                        src={star <= product.rating ? "/staryellow.svg" : "/star.svg"}
                        className="w-5"
                        alt=""
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
            <p className="text-gray-500 mb-2 py-2">
              <span className="text-gray-700 mb-2 font-bold">Discount:</span>{" "}
              {product.discount + "% OFF"}
            </p>
            <button
              onClick={() => handleClick(product)}
              className="cursor-pointer py-2 px-4 border rounded text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompareProducts;
