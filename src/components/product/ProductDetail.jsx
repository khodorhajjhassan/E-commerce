import axios from "axios";
import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { addProductToCart } from "../../redux/cartSlice";
import { addProductToWishlist } from "../../redux/wishlistSlice";

const ProductDetail = () => {
  const [click, setClick] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [colorQuantity, setColorQuantity] = useState(0);
  const [color, setColor] = useState("");
  const [shoeRating, setShoeRating] = useState(0);
  const [size, setSize] = useState("");
  const [isSoldOut, setIsSoldOut] = useState(false);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const isProductInCart = useSelector((state) =>
    state.user.cart.products.some((product) => product._id === id)
  );
  const isProductInWish = useSelector((state) =>
    state.user.wishlist.products.some((product) => product._id === id)
  );

  const dispatch = useDispatch();

  const handleImageClick = (imageUrl) => {
    setClick(imageUrl);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/shoe/${id}`);
        const productData = response.data;
        const feedbackres = await axios.get(
          `http://localhost:8000/feedback/averagefeedback/${id}`
        );

        setShoeRating(feedbackres.data);
        setProduct(productData);
        const sizeInfo =
          productData.color[0]?.sizes.find(
            (size) => size.size && size.quantity > 0
          ) || {};
        const selectedSize = sizeInfo.size || null;
        const selectedQuantity = sizeInfo.quantity || 0;
        console.log("sizeInfo=>", sizeInfo);
        console.log("selectedSize=>", selectedSize);
        console.log("selectedQuantity=>", selectedQuantity);
        setSelectedSize(selectedSize);
        setSize(selectedSize);
        setSelectedColor(productData.color[0]?.colorName || null);
        setColor(productData.color[0]?.colorName || null);
        setColorQuantity(selectedQuantity);
        setIsLoading(false);

        if (
          productData.color.every((color) =>
            color.sizes.every((size) => size.quantity === 0)
          )
        ) {
          setIsSoldOut(true);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleColorClick = (color) => {
    setSelectedColor(
      color.colorName === selectedColor ? null : color.colorName
    );
    setColor(color.colorName);

    const firstAvailableSize = color.sizes.find((size) => size.quantity > 0);
    setSelectedSize(firstAvailableSize?.size || null);
    setSize(firstAvailableSize?.size || null);
    setColorQuantity(firstAvailableSize?.quantity || 0);

    setQuantity(1);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size === selectedSize ? null : size);
    setSize(size);

    const selectedColorObject = product.color.find(
      (color) => color.colorName === selectedColor
    );
    const selectedSizeObject = selectedColorObject?.sizes.find(
      (s) => s.size === size
    );

    setColorQuantity(selectedSizeObject?.quantity || 0);
    setQuantity(1);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    dispatch(addProductToCart({ ...product, quantity, color, size }));
  };

  const handleWishClick = (e) => {
    e.preventDefault();
    dispatch(addProductToWishlist({ ...product, quantity, color, size }));
  };

  //const cartProducts = useSelector((state) => state.user.cart.products);
  //const wishProducts = useSelector((state) => state.user.wishlist.products);

  const [product, setProduct] = useState(null);

  return (
    <>
      <div className="bg-white">
        <div className="md:w-4/5 m-auto p-5">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <TailSpin color="#007BFF" size={40} />
            </div>
          ) : product.length === 0 ? (
            <div className="text-center text-xl">No products found.</div>
          ) : (
            <div className="grid gap-4 my-10 md:grid-cols-2 justify-center">
              <div className="w-full h-auto">
                <div className="w-full h-96 mb-1">
                  {click ? (
                    <img
                      src={click}
                      className="w-full h-full object-contain"
                      alt=""
                    />
                  ) : (
                    <img
                      src={product.productimg[0]}
                      className="w-full h-full object-contain"
                      alt=""
                    />
                  )}
                </div>
                <div className="grid gap-2 grid-cols-3">
                  <img
                    onClick={() => handleImageClick(product.productimg[0])}
                    className="cursor-pointer w-full h-32 object-contain"
                    src={product.productimg[0]}
                    alt=""
                  />
                  <img
                    onClick={() => handleImageClick(product.productimg[1])}
                    className="cursor-pointer w-full h-32 object-contain"
                    src={product.productimg[1]}
                    alt=""
                  />
                  <img
                    onClick={() => handleImageClick(product.productimg[2])}
                    className="cursor-pointer w-full h-32 object-contain"
                    src={product.productimg[2]}
                    alt=""
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-bold text-black-500 text-black">
                  {product.name}
                </h2>
                <h2 className="text-xl font-bold text-gray-500 italic">
                  {product.producer}
                </h2>
                <div className="flex gap-2">
                  <ul className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <li key={star}>
                        <img
                          src={
                            star <= shoeRating.averageRating
                              ? "/staryellow.svg"
                              : "/star.svg"
                          }
                          className="w-5"
                          alt=""
                        />
                      </li>
                    ))}
                  </ul>
                  <p className="font-bold">
                    {shoeRating.averageRating !== 0
                      ? `${shoeRating.averageRating}/5`
                      : "No Rating Yet"}
                  </p>
                </div>

                <div className="flex">
                  <span className="text-3xl font-bold text-black">
                    {!product.discount
                      ? product.price.toFixed(2)
                      : (
                          product.price -
                          (product.discount / 100) * product.price
                        ).toFixed(2)}
                    $
                  </span>
                  {product.discount && (
                    <span className="text-xl text-black line-through">
                      {product.price + "$"}
                    </span>
                  )}
                </div>
                <h5 className="text-black text-2xl font-bold">Description</h5>
                <p>{product.description}</p>
                <h5 className="text-black text-2xl font-bold">Color</h5>
                <div className="flex gap-2">
                  {product.color.map(
                    (color) =>
                      color.sizes.some((size) => size.quantity > 0) && ( // Check if any size has quantity > 0
                        <button
                          key={color.colorName}
                          onClick={() => handleColorClick(color)}
                          type="button"
                          className={`block w-5 h-5 rounded-full border-2 border-gray-300 ${
                            color.colorName === selectedColor
                              ? "scale-150"
                              : "hover:scale-125 hover:bg-gray-200"
                          } duration-300`}
                          style={{ background: color.colorName }}
                        ></button>
                      )
                  )}
                </div>

                <h5 className="text-black text-2xl font-bold">Size</h5>
                <div className="flex gap-2">
                  {product.color
                    .find((color) => color.colorName === selectedColor)
                    ?.sizes.map(
                      (sizeObject) =>
                        sizeObject.quantity > 0 && (
                          <button
                            key={sizeObject.size}
                            onClick={() => handleSizeClick(sizeObject.size)}
                            type="button"
                            className={`block w-8 h-8 border-2 duration-300 ${
                              sizeObject.size === selectedSize
                                ? "bg-gray-200"
                                : "hover:bg-gray-200"
                            } text-black border-gray-400`}
                          >
                            {sizeObject.size}
                          </button>
                        )
                    )}
                </div>
                <div className="flex gap-2 mt-5 items-center">
                  <button
                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                    className="border-2 w-10 h-10 rounded-full bg-red-500 text-white text-xl duration-300 hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="text-2xl mx-2">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(quantity + 1, colorQuantity))
                    }
                    className="border-2 w-10 h-10 rounded-full bg-blue-500 text-white text-xl duration-300 hover:bg-blue-600"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={handleCartClick}
                    disabled={isSoldOut || isProductInCart}
                    className={`w-full flex-1 p-2 ${
                      isSoldOut || isProductInCart
                        ? "bg-gray-300 text-gray-600"
                        : "bg-blue-500 text-white"
                    } rounded duration-300 hover:bg-blue-600 flex gap-1 justify-center`}
                  >
                    <img src="/cart.svg" className="w-6" alt="" />
                    {isSoldOut
                      ? "Sold Out"
                      : isProductInCart
                      ? "Already in Cart"
                      : "Add To Cart"}
                  </button>
                  <button
                    onClick={handleWishClick}
                    disabled={isProductInWish}
                    className={`w-full flex-1 p-2 ${
                      isProductInWish
                        ? "bg-gray-300 text-gray-600"
                        : "bg-red-500 text-white"
                    } rounded duration-300 hover:bg-red-600 flex gap-1 justify-center`}
                  >
                    <img src="/heart.svg" className="w-6" alt="" />
                    {isProductInWish ? "Already in Wishlist" : "Wish List"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
