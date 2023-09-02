import axios from "axios";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeProductFromWishlist } from "../../redux/wishlistSlice";

const AddToWishlist = () => {
  const [clickedIndex, setClickedIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const wishProducts = useSelector((state) => state.user.wishlist);
  //const cartProducts = useSelector((state) => state.user.cart.products);

  const user = useSelector((state) => state.user.user);
  const id = user?.userDetails?.id || "";
  //const wishItems = wishProducts.products.map((val)=>val._id)

  const dispatch = useDispatch();

  useEffect(() => {
    const addToWish = async () => {
      try {
        //console.log(user?.userDetails?.id)
        if (user?.userDetails?.id) {
          const res = await axios.get(
            `http://localhost:8000/user/wishlist/${id}`
          );
          setProducts(res.data);
          //console.log( res)
        }
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    addToWish();
  }, [user]);

  const productShow = user?.userDetails ? products : wishProducts.products;
  const numberOfItems = user?.userDetails
    ? products.length
    : wishProducts.products.length;

  const handleProductClick = (index) => {
    if (clickedIndex === index) {
      setClickedIndex(null);
    } else {
      setClickedIndex(index);
    }
  };

  const handleClick = (product) => {
    const removeProduct = async () => {
      try {
        if (user?.userDetails?.id) {
          const res = await axios.delete(
            `http://localhost:8000/user/${id}/${product._id}`
          );
          const updatedProducts = products.filter((p) => p._id !== product._id);
          setProducts(updatedProducts);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (user?.userDetails) {
      removeProduct();
    } else {
      dispatch(removeProductFromWishlist(product));
    }
  };
  return (
    <div className="m-auto mt-5 2xl:px-0 w-4/5 items-center">
      <div className="relative jusitfy-start items-start">
        <div className="mt-3">
          <h1 className="text-3xl lg:text-4xl tracking-tight font-semibold leading-8 lg:leading-9 text-gray-800">
            Favourites
          </h1>
        </div>
        <div className="my-4">
          <p
            className={`text-lg mb-2  tracking-tight leading-6 text-red-500 italic ${
              user?.userDetails ? "hidden" : "block"
            }`}
          >
            Please Signin To prevent lose your WishList
          </p>

          <p className="text-2xl  tracking-tight leading-6 text-gray-600">
            {numberOfItems} items
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <TailSpin color="#007BFF" size={40} />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-4 grid-cols-2 lg:grid-cols-6">
            {productShow.map((product, index) => (
              <div key={product._id} className="relative p-5">
                <div className="w-full h-40">
                  <img
                    className="w-full h-full object-contain"
                    src={product.productimg[1]}
                    alt={product.productimg[1]}
                  />
                  <button
                    onClick={() => handleClick(product)}
                    aria-label="close"
                    className="top-4 right-4  duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 absolute p-1.5 bg-gray-800 text-white hover:text-gray-400"
                  >
                    <svg
                      className="fil-current"
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 1L1 13"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 1L13 13"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex justify-center items-center">
                    <p className="tracking-tight md:text-lg text-base font-semibold leading-6 text-gray-800">
                      {product.name}
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <button
                      aria-label="show menu"
                      onClick={() => handleProductClick(index)} // Pass the index of the clicked product
                      className="focus:outline-none md:ml-0 ml-4 duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-2.5 px-2 bg-gray-800 text-white hover:text-gray-400"
                    >
                      <svg
                        className={`fill-stroke ${
                          clickedIndex === index ? "block" : "hidden"
                        }`}
                        width={10}
                        height={6}
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 5L5 1L1 5"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <svg
                        className={`fill-stroke ${
                          clickedIndex === index ? "hidden" : "block"
                        }`}
                        width={10}
                        height={6}
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  id={`menu${index + 1}`}
                  className={`flex-col justify-start items-start mt-12 ${
                    clickedIndex === index ? "flex" : "hidden"
                  }`}
                >
                  <div>
                    <p className="tracking-tight text-xs leading-3 text-gray-800">
                      {product.code}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="tracking-tight text-base font-medium leading-4 text-gray-800">
                      <span className="font-bold text-gray-900">Brand: </span>
                      {product.producer}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="tracking-tight text-base font-medium leading-4 text-gray-800">
                      <span className="font-bold text-gray-900">Price: </span>
                      {product.discount !== 0
                        ? (
                            product.price -
                            (product.discount / 100) * product.price
                          ).toFixed(2)
                        : product.price}
                      $
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-2 items-center mt-10 w-full ">
                    <div className="w-full">
                      <Link to={`/productdetails/${product._id}`}>
                        <button className=" duration-300 focus:ring-gray-800 focus:ring-offset-2 w-full focus:ring-2 text-gray-800  tracking-tight p-1 text-md  hover:bg-gray-300 hover:text-gray-800 bg-white border border-gray-800">
                          More information
                        </button>
                      </Link>
                    </div>
                    <div className="w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToWishlist;
