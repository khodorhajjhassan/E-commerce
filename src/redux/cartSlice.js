import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  quantity: 0,
  total: 0.0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      const productToAdd = action.payload;

      if (productToAdd.discount > 0) {
        productToAdd.price = (
          productToAdd.price -
          (productToAdd.discount / 100) * productToAdd.price
        ).toFixed(2);
      } else {
        productToAdd.price = productToAdd.price.toFixed(2);
      }

      state.quantity += 1;

      // Convert the price to a floating-point number
      const productPrice = parseFloat(productToAdd.price);
      state.total = parseFloat(
        (state.total + productPrice * productToAdd.quantity).toFixed(2)
      );

      state.products.push(productToAdd);
    },

    removeProductFromCart: (state, action) => {
      const productToRemove = action.payload;
      const indexToRemove = state.products.findIndex(
        (product) => product._id === productToRemove._id
      );

      if (indexToRemove !== -1) {
        const removedProduct = state.products[indexToRemove];

        // Convert the price to a floating-point number
        const removedProductPrice = parseFloat(removedProduct.price);
        state.total = parseFloat(
          (state.total - removedProductPrice * removedProduct.quantity).toFixed(
            2
          )
        );

        state.products.splice(indexToRemove, 1);
        state.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0.0;
    },
  },
});

export const { addProductToCart, removeProductFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
