import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { removeuser } from "../../redux/userSlice";
import NavLinks from "./NavLinks";
import Top from "./Top";
import { useEffect, useState } from "react";

function hasDatePassed(storedDateString) {
  const storedDate = new Date(storedDateString);
  const currentDate = new Date();
  return storedDate < currentDate;
}

export const NavLayout = ({Title}) => {

  const [user,setUser]=useState({})

  const name = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const hasVisited = localStorage.getItem("storedDate");

  const id = name?.userDetails?.id || "";


  if (hasDatePassed(hasVisited)) {
    localStorage.removeItem("storedDate");
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    localStorage.setItem("storedDate", newDate.toISOString());
    (async () => {
      try {
        await axios.post("http://localhost:8000/visteduser/track-visited-user");
      } catch (error) {
        console.error("Error tracking user visit:", error);
      }
    })();
  }
  useEffect(() => {
    const getUser = async () => {
      try {
        if (name?.userDetails?.id) {
          const res = await axios.get(
            `http://localhost:8000/user/${id}`
          );
          setUser(res.data)
          //console.log( res)
        }
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  },[user]);
  const users= user.title;
  const handleLogout = () => {
    axios
      .get("http://localhost:8000/auth/logout", { withCredentials: true })
      .then((response) => {
        dispatch(removeuser());
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };
  return (
    <div className="root-layout ">
      <header>
        <Top Title={users}/>
        <nav className="bg-white">
          <div className="flex items-center font-medium justify-around">
            <ul className="md:flex hidden uppercase items-center gap-8 font-[Poppins]">
              <li>
                <NavLink
                  to="/"
                  className="py-2 px-3 inline-block duration-300 hover:text-red-500 font-bold"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLinks />
              </li>
              {/* <li className={` ${name?.userDetails ? "block opacity-100" :"hidden opacity-0"} `}>
            <NavLink to={name?.userDetails ? "/order" :"/login"} className={`  duration-300 hover:text-red-500 font-bold`}>
              {name?.userDetails ? "Order" : ""}
            </NavLink>
          </li>
          <li>
          <NavLink to={name?.userDetails ? "/" : "/login"} className="py-2 px-3 inline-block duration-300 hover:text-red-500 font-bold" onClick={name?.userDetails ? handleLogout : null}>
  {name?.userDetails ? "Logout" : "Login"}
</NavLink>


          </li> */}
              <li>
                <div className="px-3 text-left md:cursor-pointer group">
                  <h1 className="py-7 flex justify-between duration-300 hover:text-red-500 font-bold items-center md:pr-0 pr-5 group">
                    <img src="/userr.svg" className="w-8" alt="" />

                    <span className="text-xl md:mt-1 md:ml-2 duration-300  md:block hidden group-hover:rotate-180 group-hover:-mt-2">
                      <ion-icon name="chevron-down"></ion-icon>
                    </span>
                  </h1>
                  <div>
                    <div className="absolute top-42 w-64 shadow-md shadow-gray-300  z-40 hidden duration-300 group-hover:md:block hover:md:block">
                      {/* <div className="">
                        <div
                          className="w-4 h-4 left-3 absolute mt-1 bg-red-500 rotate-45"
                        ></div>
                      </div> */}
                      <div className="bg-white p-5  grid grid-cols-3 gap-10">
                        <div>
                          {/* <h1 className="text-lg font-semibold text-gray-700">
                              Logineee
                            </h1> */}
                          <li className="text-md text-gray-600 my-2.5 flex gap-4 items-center ">
                            <NavLink
                              to={name?.userDetails ? "/details" : "/login"}
                              className={` inline-block duration-300 hover:text-red-500 font-bold ${
                                name?.userDetails ? "text-red-400" : ""
                              }`}
                            >
                              {name?.userDetails
                                ? user.title
                                : "Login"}
                            </NavLink>
                            <span className="font-bold text-xl">|</span>
                            <NavLink
                              to={name?.userDetails ? "/" : "/join"}
                              onClick={name?.userDetails ? handleLogout : null}
                              className="hover:text-red-500 duration-300 font-bold"
                              // onClick={handleNavClick}
                            >
                              {name?.userDetails ? "Logout" : "Join"}
                            </NavLink>
                          </li>

                          <li className="text-md text-gray-600 my-2.5 flex gap-6 items-center mt-5 mb-6">
                            <img
                              src="/orderr.svg"
                              className="w-6 flex-1"
                              alt=""
                            />
                            <NavLink
                              to={name?.userDetails ? "/order" : "/login"}
                              className="hover:text-red-500 duration-300 text-start"
                              // onClick={handleNavClick}
                            >
                              Orders
                            </NavLink>
                          </li>
                          <li className=" text-gray-600 my-2.5 flex gap-6 items-center w-full">
                            <img
                              src="/location.svg"
                              className="w-6 flex-1"
                              alt=""
                            />
                            <NavLink
                              to={"/track"}
                              className="hover:text-red-500 duration-300 text-start"
                              // onClick={handleNavClick}
                            >
                              Track
                            </NavLink>
                          </li>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <hr />
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
