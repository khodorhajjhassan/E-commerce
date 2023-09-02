// authUtils.js

import axios from "axios";
import { removeuser } from "../redux/userSlice.js";
import { store } from "../redux/store.js";

export const refreshAccessToken = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/auth/refreshToken",
      { withCredentials: true }
    );
    const { token } = response.data;
    // Update the access token in your frontend application
    return token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    store.dispatch(removeuser());
    window.location.href = "/login";
  }
};
