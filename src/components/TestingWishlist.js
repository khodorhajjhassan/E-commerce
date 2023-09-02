import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addProductToWishlist,
  clearWishlist,
  removeProductFromWishlist,
} from '../redux/wishlistSlice.js'; // Import the wishlistSlice and action creators

const TestingWishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.user.wishlist.products);

  const handleAddToWishlist = () => {
    // Add a new product to the wishlist
    const newProduct = {
      id: 4,
      name: 'Product 4',
      price: 7.49,
    };
    dispatch(addProductToWishlist(newProduct));
  };

  const handleRemoveFromWishlist = (productId) => {
    // Remove a product from the wishlist by its ID
    dispatch(removeProductFromWishlist({ id: productId }));
  };

  const handleClearWishlist = () => {
    // Clear the entire wishlist
    dispatch(clearWishlist());
  };

  return (
    <div>
      <h1>Wishlist</h1>
      <ul>
        {wishlist.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => handleRemoveFromWishlist(product.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddToWishlist}>Add Product to Wishlist</button>
      <button onClick={handleClearWishlist}>Clear Wishlist</button>
    </div>
  );
};

export default TestingWishlist;
