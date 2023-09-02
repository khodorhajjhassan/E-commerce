import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  quantity: 0,
  total: 0,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addProductToWishlist: (state, action) => {
      const productToAdd = action.payload;
      state.quantity += productToAdd.quantity;
      state.products.push(productToAdd);
      state.total += productToAdd.price * productToAdd.quantity;
    },
    removeProductFromWishlist: (state, action) => {
      const productToRemove = action.payload;
      const indexToRemove = state.products.findIndex(
        (product) => product._id === productToRemove._id
      );

      if (indexToRemove !== -1) {
        const removedProduct = state.products[indexToRemove];
        state.products.splice(indexToRemove, 1);
        state.quantity -= removedProduct.quantity;
        state.total -= removedProduct.price * removedProduct.quantity;
      }
    },
    clearWishlist: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const {
  addProductToWishlist,
  removeProductFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
