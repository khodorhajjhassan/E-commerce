import "animate.css/animate.min.css";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import WOW from "wow.js";
import "wow.js/css/libs/animate.css";
import AddToCart from "../../components/cart/AddToCart";
import Search from "../../components/search/Search";
import { removeuser } from "../../redux/userSlice";
import NavLinks from "./NavLinks";

// import AddToWishlist from '../../components/whishlist/AddToWishlist';

const Top = ({Title}) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const [wishclick, setWishClick] = useState(false);
  // const [wishopen,setWishOpen]=useState(false)
  const inputRef = useRef(null);
  const handelClick = () => {
    setOpen(!open);
  };
  const [isCartOpen, setCartOpen] = useState(false);
  const dispatch = useDispatch();
  // const [iswishopen, setisWishOpen] = useState(false);

  // const handleWishClick = () => {

  //   setisWishOpen(!iswishopen);
  // };

  // const closeModal = () => {

  //   setCartOpen(isCartOpen);
  // };

  const closeModal = useCallback(() => {
    setCartOpen(!isCartOpen);
  }, [isCartOpen]);
  // const closeWishModal = () => {

  //   setisWishOpen(iswishopen);
  // };
  const user = useSelector((state) => state.user.user);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (user?.userDetails) {
      const addToWish = async () => {
        try {
          if (user?.userDetails?.id) {
            const res = await axios.get(
              `http://localhost:8000/user/wishlist/${user.userDetails.id}`
            );
            setProducts(res.data);
            //console.log( res)
          }
        } catch (err) {
          console.log(err);
        }
      };
      addToWish();
    }
  }, [products]);
  const quantity = useSelector((state) => state.user.cart.quantity);

  const wishquantity = useSelector(
    (state) => state.user.wishlist.products.length
  );
  const numberOfItems = user?.userDetails ? products.length : wishquantity;
  const handleSearchClick = (event) => {
    if (event.keyCode === 13) {
      const inputValue = event.target.value;
      // Do something with the inputValue (e.g., store it in state or perform a search)
      //console.log('Input value on Enter:', inputValue);
      window.location.href = `/product/search?q=${inputValue}`;
    }
  };
  const handleLogout = () => {
    axios
      .get("http://localhost:8000/auth/logout", { withCredentials: true })
      .then((response) => {
        dispatch(removeuser());
        handelClick();
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

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

  return (
    <div className="bg-white py-3 ">
      <div className="flex items-center md:w-4/5 m-auto  justify-between md:border-none md:mb-0 mb-5 border-b-2   ">
        <Link to="/">
          <div
            className="w-64 flex items-center md:w-64 sm:w-32 z-50"
            alt="Logo"
          >
            <div
              className="bg-rose-300 z-50  md:w-8 md:h-8 w-6 h-6 rounded-full border-2 md:font-bold font-normal text-center md:text-xl text-white md:leading-7 leading-5  text-sm wow bounceInLeft "
              data-wow-delay="0.6s"
            >
              F
            </div>
            <div
              className="bg-rose-300 z-50 md:w-8 md:h-8 w-6 h-6 rounded-full border-2 md:font-bold font-normal text-center md:text-xl text-white md:leading-7 leading-5  text-sm wow bounceInLeft"
              data-wow-delay="0.6s"
            >
              O
            </div>
            <div
              className="bg-rose-300 z-50 md:w-8 md:h-8 w-6 h-6 rounded-full border-2 md:font-bold font-normal text-center md:text-xl text-white md:leading-7 leading-5  text-sm wow bounceInLeft "
              data-wow-delay="0.6s"
            >
              O
            </div>
            <div
              className="bg-rose-300 z-50 md:w-8 md:h-8 w-6 h-6 rounded-full border-2 md:font-bold font-normal text-center md:text-xl text-white md:leading-7 leading-5  text-sm wow bounceInLeft "
              data-wow-delay="0.6s"
            >
              T
            </div>
            <div
              className="bg-rose-300 z-50 md:w-8 md:h-8 w-6 h-6 rounded-full border-2 md:font-bold font-normal text-center md:text-xl text-white md:leading-7 leading-5  text-sm wow wobble "
              data-wow-delay="1s"
            >
              V
            </div>
            <div
              className="bg-rose-300 z-50 md:w-8 md:h-8 w-6 h-6 rounded-full border-2 md:font-bold font-normal text-center md:text-xl text-white md:leading-7 leading-5  text-sm wow wobble "
              data-wow-delay="1s"
            >
              I
            </div>
            <div
              className="bg-rose-300 z-50 md:w-8 md:h-8 w-6 h-6 rounded-full border-2 md:font-bold font-normal text-center md:text-xl text-white md:leading-7 leading-5  text-sm wow wobble "
              data-wow-delay="1s"
            >
              B
            </div>
            <div
              className="bg-rose-300 z-50 md:w-8 md:h-8 w-6 h-6 rounded-full border-2 md:font-bold font-normal text-center md:text-xl text-white md:leading-7 leading-5  text-sm wow wobble "
              data-wow-delay="1s"
            >
              E
            </div>
          </div>
        </Link>
        {/* <div className='w-40 md:w-48 sm:w-32 z-40'>
        <img src="logo.png" alt=""  className="w-full "/>

        </div> */}

        <div className="md:flex flex md:w-2/4 w-auto items-center justify-end  md:gap-4 gap-0  text-3xl  ">
          <div className="flex w-96 relative md:block hidden ">
            <Search />
            {/* <input
      ref={inputRef}
      className={`p-1 placeholder-italic placeholder-slate-300 text-sm placeholder-sm block bg-white w-full border border-slate-300 rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm duration-500 mx-2 bg-white border-2 ${click ? 'opacity-100 visible w-auto' : 'opacity-0 invisible'}`}
      placeholder="Search for anything..."
      type="text"
      name="search"
      onKeyDown={handleSearchClick}
    /> */}
          </div>
          <Link to="/wishlist">
            <div className="relative md:w-8 w-6 mx-2 md:mx-0 cursor-pointer ">
              <img src="/heart.svg" className="w-full" alt="" />
              {
                <div
                  className={`absolute inline-flex items-center justify-center md:w-6 md:h-6 w-4 h-4 text-xs font-bold text-white bg-rose-300 border-1 border-white rounded-full md:-top-2 md:-right-2 -top-1 -right-1 dark:border-gray-900 ${
                    numberOfItems > 0 ? "block" : "hidden"
                  }`}
                >
                  {numberOfItems > 0 && numberOfItems}
                </div>
              }
            </div>
          </Link>
          <div
            className="relative w-8 cursor-pointer "
            onClick={() => setCartOpen(!isCartOpen)}
          >
            <img src="/cart.svg" className="md:w-8 w-6" alt="" />
            <div
              className={`absolute inline-flex items-center justify-center md:w-6 md:h-6 w-4 h-4 text-xs font-bold text-white bg-rose-300 border-1 border-white rounded-full md:-top-2 md:-right-2 -top-1 -right-1 dark:border-gray-900 ${
                quantity > 0 ? "block" : "hidden"
              } `}
            >
              {quantity > 0 && quantity}
            </div>
          </div>
          <div
            className="z-50 text-2xl  cursor-pointer md:hidden mr-2 mt-1"
            onClick={() => setOpen(!open)}
          >
            <ion-icon name={`${open ? "close" : "menu"}`}></ion-icon>
          </div>
        </div>

        <ul
          className={`
        md:hidden bg-white fixed w-full top-0 overflow-y-auto bottom-0 py-24 pl-4
        duration-500 z-40 ${open ? "left-0" : "left-[-100%]"}
        `}
        >
          <li>
            <NavLink
              to="/details"
              onClick={handelClick}
              className={`py-7 px-3 inline-block duration-300 text-rose-400 font-bold ${
                user?.userDetails ? "block" : "hidden"
              }`}
            >
              {user?.userDetails ? Title : ""}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/"
              onClick={handelClick}
              className="py-7 px-3 inline-block duration-300 hover:text-red-500 font-bold"
            >
              Home
            </NavLink>
          </li>
          <NavLinks handelClick={handelClick} />

          <li>
            <NavLink
              to={user?.userDetails ? "/order" : "/login"}
              onClick={handelClick}
              className={`py-2  px-3 inline-block duration-300 hover:text-red-500 font-bold `}
            >
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/track"
              onClick={handelClick}
              className="py-2 px-3 inline-block my-5 duration-300 hover:text-red-500 font-bold"
            >
              Track
            </NavLink>
          </li>
          <li>
            <NavLink
              to={user?.userDetails ? "/" : "/login"}
              onClick={user?.userDetails ? handleLogout : handelClick}
              className="py-2 px-3 inline-block duration-300 hover:text-red-500 font-bold"
            >
              {user?.userDetails ? "logout" : "login"}
            </NavLink>
          </li>
        </ul>
      </div>
      {/* <div className='w-96 m-auto md:hidden block'>
      <Search />
      </div> */}
      {isCartOpen && <AddToCart isOpen={isCartOpen} onClose={closeModal} />}
      {/* {iswishopen && <AddToWishlist isOpen={iswishopen} onClose={closeWishModal} />} */}

      <div className="relative w-4/5 m-auto my-2 md:hidden block">
        <Search />
        <img
          src="/search.svg"
          className="md:w-8 w-9 absolute md:hidden block right-3 top-0"
          alt=""
        />
      </div>
    </div>
  );
};

export default Top;
