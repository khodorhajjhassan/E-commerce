import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { menu } from "../../../data.js";
import { removeuser } from "../../../redux/userSlice";
import "./menu.scss";

const MenuLayout = () => {
  const id = useSelector((state) => state.user?.user?.userDetails?.id);
  //console.log(id)

  const dispatch = useDispatch();
  const handleLogout = () => {
    axios
      .get("http://localhost:8000/auth/logout", { withCredentials: true })
      .then((response) => {
        dispatch(removeuser());
      })
      .catch((error) => {
        // Handle any error that occurred during the logout process
        console.error("Logout failed:", error);
      });
  };

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <NavLink
              to={listItem.title === "Profile" ? `users/${id}` : listItem.url}
              className="listItem"
              key={listItem.id}
            >
              <img className="" src={listItem.icon} alt="" />
              <span className="listItemTitle">{listItem.title}</span>
            </NavLink>
          ))}
        </div>
      ))}
      <div className="item my-2">
        <button onClick={handleLogout}>
          <div className="listItem hover:text-red-400">
            <img className="w-6 h-6" src="\logout.svg" alt="" />
            <span className="text-bold text-blue-100 hidden md:hidden lg:block xl:block">
              LogOut
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MenuLayout;
