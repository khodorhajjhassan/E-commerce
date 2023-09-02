import axios from "axios";
import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ButtonRate from "./ButtonRate";
import ButtonRefund from "./ButtonRefund";

const Order = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const name = useSelector((state) => state.user.user);
  const userId = name?.userDetails.id;

  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/order/user/${userId}`
        );

        setProducts(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };
    getOrder();
  }, []);

  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const convertToDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    return `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
  };

  const handleRefundStatus = (updatedOrder) => {
    const updatedProducts = products.map((product) => {
      if (product._id === updatedOrder._id) {
        return updatedOrder;
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  return (
    <>
      <div className="md:w-4/5 w-full m-auto my-10">
        <h2 className="md:text-4xl text-3xl font-bold text-gray-700 ">
          Order Page
        </h2>
        <span className="italic text-gray-500">
          Thank you for your order from our FootVibe
        </span>
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <TailSpin color="#007BFF" size={40} />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center text-xl">No Orders found.</div>
        ) : (
          <div className="md:w-4/5 w-11/12 m-auto my-10">
            {sortedProducts.map((order) => (
              <div key={order._id} className="border-2 my-10">
                <div className="md:flex block justify-between p-5 items-center border-b-2">
                  <div>
                    <p className="mb-2">
                      Order: <span className="font-bold">#{order._id}</span>
                    </p>
                    <p className="mb-2">
                      Order Placement:{" "}
                      <span className="font-bold">
                        {convertToDate(order.createdAt)}
                      </span>
                    </p>
                  </div>
                  <div className="mb-2">
                    <h2 className="font-bold">Status</h2>
                    <h2>{order.orderStatus}</h2>
                  </div>
                  <div className="mb-2">
                    <Link to={`/trackorder/${order._id}`}>
                      <button className="bg-gray-700 duration-300 font-bold hover:bg-gray-900 text-white p-3 cursor-pointer">
                        Track Your Order
                      </button>
                    </Link>
                  </div>
                </div>
                {order.shoe.map((shoeArray, index) => {
                  const product = shoeArray[0]; // Extract the product object
                  const expectedDeliveryDate = new Date(order.createdAt);
                  expectedDeliveryDate.setDate(
                    expectedDeliveryDate.getDate() + 3
                  );
                  return (
                    <div
                      key={`product-${product._id}-${index}`}
                      className="md:flex block gap-8 justify-between p-5 border-b-2"
                    >
                      <div className="md:flex block text-center gap-8">
                        <div className="w-36 h-36 m-auto">
                          <img src={product.productimg[1]} alt="" />
                        </div>
                        <div className="flex flex-col gap-4">
                          <h2 className="font-bold">{product.name}</h2>
                          <h4>Brand: {product.producer}</h4>
                          <div className="flex gap-4 justify-center">
                            <span>Size: {product.size}</span>
                            <span>Qty: 1</span>
                            <span className="font-bold">
                              Price: {product.price}$
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center gap-4 mt-5">
                        <h2>Delivery Expected by</h2>
                        <h2 className="font-bold">
                          {convertToDate(expectedDeliveryDate)}
                        </h2>
                        <ButtonRate
                          userId={userId}
                          orderId={order._id}
                          shoeId={product._id}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between items-center">
                  <div className="text-white font-bold bg-gray-700 duration-300 hover:bg-red-500">
                    <ButtonRefund
                      order={order.orderStatus}
                      orderid={order._id}
                      handleRefundStatus={handleRefundStatus}
                      updatedAt={order.updatedAt}
                      RefundRequest={order.RefundRequest}
                    />
                  </div>
                  <div className="md:p-4 p-3">
                    <h1>
                      Total Price:{" "}
                      <span className="font-bold">{order.totalPrice}$</span>
                    </h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Order;
