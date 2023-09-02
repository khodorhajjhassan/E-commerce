// api.js

import axios from "axios";
import { store } from "./store.js";
import { removeuser } from "./userSlice.js";

const apiToken = axios.create({
  baseURL: "http://localhost:8000", // Replace with your API base URL
});

apiToken.interceptors.request.use(async (config) => {
  const { tokenExpiry } = store.getState().user.user;
  const currentTime = Date.now();
  //console.log(tokenExpiry<currentTime)
  if (tokenExpiry && tokenExpiry < currentTime) {
    // Token has expired, dispatch action to clear user state
    // console.log("expired")
    store.dispatch(removeuser());
    window.location.href = "/login";
  }

  return config;
});

/*
export function checkTokenExpiry() {
  const { tokenExpiry } = store.getState().user.user;
  const currentTime = Date.now();

  if (tokenExpiry && tokenExpiry < currentTime) {
    // Token has expired, dispatch action to clear user state
    store.dispatch(removeuser());
    window.location.href = "/login";
  }
}
*/
export default apiToken;
