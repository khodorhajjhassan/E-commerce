import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import apiToken from "../../redux/apiToken";
import { refreshAccessToken } from "../../utils/refreshAccessToken";

const NavLinks = ({ handelClick }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const user = useSelector((state) => state.user?.user?.userDetails);
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        if (!user) {
          const response = await axios.get("http://localhost:8000/category");
          setCategoryData(response.data);
        } else {
          const response = await apiToken.get(
            "http://localhost:8000/category/q",
            { withCredentials: true }
          );
          setCategoryData(response.data);
        }
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              const response = await apiToken.get(
                "http://localhost:8000/category/q",
                {
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                  withCredentials: true,
                }
              );
              setCategoryData(response.data);
            }
            setIsLoading(false);
          } catch (error) {
            console.error("Error fetching data with token:", error);
            try {
              const response = await axios.get(
                "http://localhost:8000/category"
              );
              setCategoryData(response.data);
            } catch (error) {
              console.error("Error fetching data without token:", error);
            }
            setIsLoading(false);
          }
        }
      }
    };

    fetchCategoryData();
  }, []);

  const handleNavClick = () => {
    // Your click handler logic here
    // For example, you can do something when a link in the navigation is clicked
  };

  // Helper function to transform the data received from the server to match the structure of the links data
  const transformData = (dataFromDatabase) => {
    return dataFromDatabase.map((category) => ({
      name: category.name,
      submenu: true,
      sublinks: category.subcategories.map((subcategory) => ({
        Head: subcategory.name,
        sublink: subcategory.subsubcategories.map((subsubcategory) => ({
          name: subsubcategory,
          link: `product/${category.name}/${subcategory.name}/${subsubcategory}`,
        })),
      })),
    }));
  };

  const transformedData = transformData(categoryData);

  return (
    <div className="flex flex-col md:flex-row">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {transformedData.map((category) => (
            <div key={category.name}>
              <div className="px-3 text-left md:cursor-pointer group">
                <h1
                  className="py-7 flex justify-between duration-300 hover:text-red-500 font-bold items-center md:pr-0 pr-5 group"
                  onClick={() => {
                    heading !== category.name
                      ? setHeading(category.name)
                      : setHeading("");
                    setSubHeading("");
                  }}
                >
                  {category.name}
                  <span className="text-xl md:hidden inline">
                    <ion-icon
                      name={`${
                        heading === category.name
                          ? "chevron-up"
                          : "chevron-down"
                      }`}
                    ></ion-icon>
                  </span>
                  <span className="text-xl md:mt-1 md:ml-2 duration-300  md:block hidden group-hover:rotate-180 group-hover:-mt-2">
                    <ion-icon name="chevron-down"></ion-icon>
                  </span>
                </h1>
                {category.submenu && (
                  <div>
                    <div className="absolute top-32 shadow-md shadow-gray-300  z-40 hidden duration-300 group-hover:md:block hover:md:block">
                      <div className="py-3">
                        <div className="w-4 h-4 left-3 absolute mt-1 bg-red-500 rotate-45"></div>
                      </div>
                      <div className="bg-white p-5  grid grid-cols-3 gap-10">
                        {category.sublinks.map((mysublinks) => (
                          <div key={mysublinks.Head}>
                            <h1 className="text-lg font-semibold text-gray-700">
                              {mysublinks.Head}
                            </h1>
                            {mysublinks.sublink.map((slink) => (
                              <li
                                className="text-sm text-gray-600 my-2.5"
                                key={slink.name}
                              >
                                <NavLink
                                  to={slink.link}
                                  className="hover:text-red-500 duration-300"
                                  onClick={handleNavClick}
                                >
                                  {slink.name}
                                </NavLink>
                              </li>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Mobile menus */}
              <div
                className={`${
                  heading === category.name ? "md:hidden" : "hidden"
                }`}
              >
                {/* sublinks */}
                {category.sublinks.map((slinks) => (
                  <div key={slinks.Head}>
                    <div>
                      <h1
                        onClick={() =>
                          subHeading !== slinks.Head
                            ? setSubHeading(slinks.Head)
                            : setSubHeading("")
                        }
                        className="py-4 pl-2  font-semibold md:pr-0 pr-5 flex justify-between items-center md:pr-0 pr-5"
                      >
                        {slinks.Head}
                        <span className="text-xl md:mt-1 md:ml-2 inline">
                          <ion-icon
                            name={`${
                              subHeading === slinks.Head
                                ? "chevron-up"
                                : "chevron-down"
                            }`}
                          ></ion-icon>
                        </span>
                      </h1>
                      <div
                        className={`${
                          subHeading === slinks.Head ? "md:hidden" : "hidden"
                        }`}
                      >
                        {slinks.sublink.map((slink) => (
                          <li className="py-3 pl-2" key={slink.name}>
                            <NavLink to={slink.link} onClick={handelClick}>
                              {slink.name}
                            </NavLink>
                          </li>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default NavLinks;
