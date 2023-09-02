import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  quantity: 0,
  total: 0,
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addProductToCompare: (state, action) => {
      if (state.quantity === 3) {
        return;
      }
      state.quantity += 1;
      state.products.push(action.payload);
      state.total += action.payload.price * action.payload.quantity;
    },
    removeProductFromCompare: (state, action) => {
      const productToRemove = action.payload;
      const indexToRemove = state.products.findIndex(
        (product) => product._id === productToRemove._id
      );

      if (indexToRemove !== -1) {
        const removedProduct = state.products[indexToRemove];
        const updatedProducts = state.products.filter(
          (product, index) => index !== indexToRemove
        );

        state.products = updatedProducts;
        state.quantity -= 1;

        state.total -= removedProduct.price * removedProduct.quantity;
      }
    },

    clearCart: (state) => {
      state.products = [];
      state.quantity = 0; // Reset the quantity to 0 when clearing the cart
      state.total = 0;
    },
  },
});

export const { addProductToCompare, removeProductFromCompare, clearCart } =
  compareSlice.actions;

export default compareSlice.reducer;
