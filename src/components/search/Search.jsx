import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";

const Search = () => {
  const [product, setProduct] = useState([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSearchClick = (event) => {
    if (event.keyCode === 13) {
      const inputValue = event.target.value;
      // Do something with the inputValue (e.g., store it in state or perform a search)
      //console.log('Input value on Enter:', inputValue);
      window.location.href = `/product/search?q=${inputValue}`;
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(true); // Show loading spinner when search starts
        const res = await axios.get("http://localhost:8000/shoe/allproducts");
        setProduct(res.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    getProduct();
  }, []);

  const filteredProducts = product.filter((item) => {
    const searchTerm = (name || "").toLowerCase();
    const fullName = (item.name || "").toLowerCase();
    const producer = (item.producer || "").toLowerCase();
    const subcategory = (item.subcategory || "").toLowerCase();
    const subsubcategory = (item.subsubcategory || "").toLowerCase();
    return (
      searchTerm &&
      (fullName.startsWith(searchTerm) ||
        producer.startsWith(searchTerm) ||
        subcategory.startsWith(searchTerm) ||
        subsubcategory.startsWith(searchTerm))
    );
  });

  return (
    <div className="">
      <div className="m-auto relative items-center text-center">
        <input
          className="border-2 w-full p-2 border-gray-400 placeholder-italic placeholder-slate-300 text-sm placeholder-sm"
          type="text"
          value={name}
          onKeyDown={handleSearchClick}
          name="search"
          ref={inputRef}
          placeholder="Search for anything..."
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <img
          src="/search.svg"
          className="md:w-9 absolute md:block hidden right-2 top-1 "
          alt=""
        />
      </div>

      <div
        className={`dropdown absolute w-full bg-white z-50 overflow-y-auto duration-500 h-0 shadow-lg ${
          name ? " h-auto max-h-96" : " h-0 max-h-0"
        } m-auto w-96`}
      >
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <TailSpin color="#007BFF" size={40} />
          </div>
        )}
        {!isLoading && (
          <>
            {filteredProducts.length === 0 && name ? (
              <div className="text-center text-xl p-2 ">
                OOPS !! No Product Found.
              </div>
            ) : (
              filteredProducts.slice(0, 10).map((item) => (
                <div key={item._id}>
                  <Link
                    to={`/productdetails/${item._id}`}
                    onClick={() => setName("")}
                  >
                    <div className="p-2 flex gap-2 items-center border-b-2 duration-300 hover:bg-gray-200">
                      <div className="w-20 h-20 rounded">
                        <img
                          src={item.productimg[1]}
                          alt=""
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-gray-700 font-bold text-sm">
                          {item.subcategory}
                        </p>
                        <p className="font-gray-600 text-sm">{item.producer}</p>
                        <h4 className="font-gray-500 text-sm">{item.name}</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
