import { useSelector } from "react-redux";
import "./navadmin.scss";
const NavadminLayout = () => {
  const name = useSelector((state) => state.user?.user?.userDetails);
  return (
    <div className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="" className="w-32 h-32 object-contain" />
      </div>
      <div className="icons">
        <a href="http://localhost:3000/admin">
          <span className="mx-2">{name.name}</span>
        </a>
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>
        <div className="user">
          <img
            src={name.profileimg ? name.profileimg : "/noavatar.png"}
            alt=""
          />
        </div>
        <a href="http://localhost:3000/admin/settings">
          <img src="/settings.svg" alt="" className="icon" />
        </a>
      </div>
    </div>
  );
};

export default NavadminLayout;
