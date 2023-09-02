import { combineReducers } from "redux";
import userReducer from "./userSlice.js"; // Update the path to your userReducer file
import wishlistReducer from "./wishlistSlice.js";
import cartReducer from "./cartSlice.js";
import compareSlice from "./compareSlice.js";

const rootReducer = combineReducers({
  user: userReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  compare: compareSlice,
});

export default rootReducer;
