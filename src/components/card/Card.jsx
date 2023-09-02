import "animate.css/animate.min.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WOW from "wow.js";
import "wow.js/css/libs/animate.css";
import apiToken from "../../redux/apiToken";
import { addProductToCompare } from "../../redux/compareSlice";
import { addProductToWishlist } from "../../redux/wishlistSlice";
import QuickView from "./QuickView";

const Card = ({
  category,
  subcategory,
  subsubcategory,
  filter,
  sort,
  search,
  bigger,
}) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterdedProducts, setFilteredProducts] = useState([]);
  //const cartProducts = useSelector((state) => state.user.cart.products);
  const wishProducts = useSelector((state) => state.user.wishlist.products);
  const [wishId, setWishId] = useState("");
  const [count, setCount] = useState(0);
  const user = useSelector((state) => state.user.user?.userDetails);
  //const compareProduct = useSelector((state) => state.user.compare?.products || []);

  useEffect(() => {
    if (user) {
      const getUser = async () => {
        try {
          const res = await apiToken.get(`/user/${user.id}`, {
            withCredentials: true,
          });
          setWishId(res.data.wishlist);
        } catch (err) {
          console.error(err);
        }
      };
      getUser();
    }
  }, []);

  useEffect(() => {
    const wow = new WOW({
      boxClass: "wow", // default
      animateClass: "animated", // default
      offset: 0, // default
      mobile: true, // default
      live: true, // default
    });
    wow.init();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      let url = "http://localhost:8000/shoe/allproducts/";
      try {
        setIsLoading(true);
        if (category || subcategory || subsubcategory || search) {
          url += "?";
          if (category) url += `category=${category}`;
          if (subcategory) url += `&subcategory=${subcategory}`;
          if (subsubcategory) url += `&subsubcategory=${subsubcategory}`;
          if (search) url += `&q=${encodeURIComponent(search)}`;
        }
        const res = await axios.get(url);

        setProducts(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };

    getProducts();
  }, [category, subcategory, subsubcategory, search]);

  useEffect(() => {
    if (category || search) {
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filter).every(([key, value]) => {
            // console.log(key)
            if (key === "color") {
              // Check if the product has at least one color with the given colorName
              return item[key].some((color) => color.colorName === value);
            } else if (key === "size") {
              // Check if the product's size array includes the given size value
              return item.color.some((color) =>
                color.sizes.some((size) => size.size === Number(value))
              );
            } else {
              // For other properties, check for equality
              return item[key].includes(value);
            }
          })
        )
      );
    }
    //console.log("new Filter=>", filter);
  }, [products, category, search, filter]);

  useEffect(() => {
    const convertToDate = (dateString) => new Date(dateString).getTime();
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort(
          (a, b) => convertToDate(b.createdAt) - convertToDate(a.createdAt)
        )
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  const handleWishClick = (product) => {
    const addTOwish = async () => {
      try {
        if (!wishId.includes(product._id)) {
          const updatedWishlist = [...wishId, product._id];

          await apiToken.put(
            `/user/${user.id}`,
            { wishlist: updatedWishlist },
            { withCredentials: true }
          );
          //console.log("Success update", res);
          setWishId(updatedWishlist);
          setCount(count + 1);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (user) {
      addTOwish();
    } else {
      dispatch(
        addProductToWishlist({
          ...product,
          quantity: 1,
          color: product.color[0].colorName,
          size: product.color[0].sizes[0].size,
        })
      );
    }
  };

  const handleCompareClick = (product) => {
    const colors = product.color.map((colorObj) => colorObj.colorName);
    dispatch(addProductToCompare({ ...product, colors }));
  };
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the first and last items to be shown on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the data array to get the items for the current page
  const currentItems = filterdedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle click on "Next" button
  const handleNextClick = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    const elementToScrollTo = document.getElementById("Top");
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle click on "Previous" button (if needed)
  const handlePreviousClick = () => {
    setCurrentPage((prevPage) => prevPage - 1);
    const elementToScrollTo = document.getElementById("Top");
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: "smooth" });
    }
  };

  const totalPages = Math.ceil(filterdedProducts.length / itemsPerPage);

  // Generate an array of page numbers
  const NUM_PAGES_DISPLAYED = 4; // Number of page numbers to display at a time

  const getPageNumbersToShow = (currentPage, totalPages) => {
    const halfDisplayed = Math.floor(NUM_PAGES_DISPLAYED / 2);
    let startPage = Math.max(currentPage - halfDisplayed, 1);
    let endPage = Math.min(startPage + NUM_PAGES_DISPLAYED - 1, totalPages);
  
    if (endPage - startPage < NUM_PAGES_DISPLAYED - 1) {
      startPage = Math.max(endPage - NUM_PAGES_DISPLAYED + 1, 1);
    }
  
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    const elementToScrollTo = document.getElementById("Top");
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: "smooth" });
    }
  };
  const view = () => {
    products.map((val) => val._id);
  };
  return (
    <>
      {isLoading ? (
        <div className="grid gap-6  lg:grid-cols-4 md:grid-cols-3 grid-cols-2">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="border border-gray-300 shadow rounded-md p-4 max-w-sm w-full mx-auto"
            >
              <div className="animate-pulse flex flex-col space-x-4">
                <div className="bg-slate-500 h-32 w-32 m-auto rounded mb-2">
                  <img src="/pic.svg" className="border-b-2" alt="" />
                </div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-400 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-400 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-400 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-400 rounded"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-400 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-400 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filterdedProducts.length === 0 ? (
        <div className="text-center text-xl">No products found.</div>
      ) : (
        <>
          <div
            className={`grid gap-6  	  ${
              bigger
                ? "lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
                : "lg:grid-cols-4 md:grid-cols-3 grid-cols-2"
            } `}
          >
            {currentItems.map((item) => (
              <div
                key={item.id}
                className={`group wow fadeIn relative flex m-auto h-auto w-full max-w-xs flex-col self-center overflow-hidden rounded-lg bg-white`}
              >
                <div
                  className="absolute top-5 right-5 z-10"
                  onClick={() => handleCompareClick(item)}
                >
                  <img
                    src="/compare.svg"
                    className="w-6 z-10  md:opacity-0  cursor-pointer hover:scale-125 duration-300  group-hover:opacity-100"
                    alt=""
                  />
                </div>
                <Link
                  to={`/productdetails/${item._id}`}
                  className="relative  shadow-md border-grey-500 border-1 mx-3 mt-3 flex h-40 overflow-hidden rounded-xl md:h-52"
                >
                  <img
                    className="peer absolute top-0 right-0 h-full w-full object-contain"
                    src={item.productimg[0]}
                    alt=""
                  />
                  <img
                    className="peer peer-hover:right-0 absolute top-0 -right-96 h-full w-full object-contain transition-all delay-100 duration-700 hover:right-0"
                    src={item.productimg[1]}
                    alt=""
                  />
                  <svg
                    className="group-hover:animate-ping group-hover:opacity-30 peer-hover:opacity-0 pointer-events-none absolute inset-x-0 bottom-5 mx-auto text-3xl text-grey-500 transition-opacity"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="currentColor"
                      d="M2 10a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v10a4 4 0 0 1-2.328 3.635a2.996 2.996 0 0 0-.55-.756l-8-8A3 3 0 0 0 14 17v7H6a4 4 0 0 1-4-4V10Zm14 19a1 1 0 0 0 1.8.6l2.7-3.6H25a1 1 0 0 0 .707-1.707l-8-8A1 1 0 0 0 16 17v12Z"
                    />
                  </svg>
                  {/* <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-1 text-center text-xs font-medium text-white">{item.color.reduce((total, color) => total + color.quantity, 0)}</span> */}
                  {item.discount > 1 ? (
                    <div>
                      {/* Your other content */}
                      <span className="absolute top-2 w-10 h-6 leading-6 left-2 rounded-full bg-gray-700 font-bold text-center text-xs font-medium text-white">
                        {item.discount + "%"}
                      </span>
                      {/* More of your content */}
                    </div>
                  ) : null}
                </Link>
                <div className="mt-4 px-5 pb-5">
                  <h5 className="text-base  tracking-tight text-gray-900">
                    {item.name.slice(0,20)+"..."}
                  </h5>

                  <div className="mt-2 mb-5 md:flex  flex-cols items-center justify-between">
                    <p>
                      <span className="text-2xl font-bold text-gray-700">
                        {!item.discount === 0
                          ? (
                              item.price -
                              (item.discount / 100) * item.price
                            ).toFixed(2)
                          : item.price}
                        $
                      </span>
                      <span className="text-sm text-gray-700 line-through">
                        {!item.discount === 0 ? item.price + "$" : ""}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuickView product={item} />
                    <div className="cursor-pointer w-6 h-6">
                      <button
                        onClick={() => handleWishClick(item)}
                        disabled={wishProducts.some(
                          (product) => product._id === item._id
                        )} // Disable the button if the product is already in the wishlist
                      >
                        <img
                          src={
                            (
                              user
                                ? user && wishId.includes(item._id)
                                : wishProducts.some(
                                    (product) => product._id === item._id
                                  )
                            )
                              ? "/heartfilled.svg"
                              : "/heart.svg"
                          }
                          className="w-full hover:scale-115 duration-300 "
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
                    <div className="flex items-center justify-center mt-10">
            {currentPage > 1 && (
              <button
                onClick={handlePreviousClick}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 duration-300 text-white rounded-md mr-2"
              >
                Previous
              </button>
            )}
            {getPageNumbersToShow(currentPage, totalPages).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={`px-4 py-2 ${
                  currentPage === pageNumber ? "bg-gray-700" : "bg-gray-500"
                } text-white rounded-md mr-2`}
              >
                {pageNumber}
              </button>
            ))}
            {currentItems.length === itemsPerPage && (
              <button
                onClick={handleNextClick}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 duration-300 text-white rounded-md ml-2"
              >
                Next
              </button>
            )}
          </div>

        </>
      )}
    </>
  );
};

export default Card;
