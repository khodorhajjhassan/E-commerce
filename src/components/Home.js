import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateuser } from "../redux/userSlice.js";
import { decrypt } from "../utils/encryptdecrypt/encryptData.js";
import Main from "./Home/Main.jsx";

export const Home = () => {
  const googledispatch = useDispatch();
  useEffect(() => {
    // Function to extract the user data from the URL query parameter
    const getUserDataFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      const userDataStr = params.get("profile");

      if (userDataStr) {
        const userData = decrypt(userDataStr);
        // console.log(userData);
        googledispatch(updateuser(userData));
      }
    };

    // Call the function to handle the user data from the query parameter
    getUserDataFromURL();
  }, [googledispatch]);

  return (
    <div className="homepage">
      <Main />
    </div>
  );
};
