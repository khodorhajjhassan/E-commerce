import axios from "axios";
import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { refreshAccessToken } from "../../utils/refreshAccessToken";
import EditStatus from "./EditStatus";

const ITEMS_PER_PAGE = 5;

const Delivery = ({ userOrders }) => {
  const [delivery, setDelivery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getDelivery = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/payment/delivery`, {
          withCredentials: true,
        });
        setDelivery(res.data);
        setIsLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            try {
              const res = await axios.get(
                `http://localhost:8000/payment/delivery`,
                {
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                  withCredentials: true,
                }
              );
              setDelivery(res.data);
              setIsLoading(false);
            } catch (error) {
              console.error("Error fetching delivery data:", error);
              setIsLoading(false);
            }
          } else {
            console.error("Failed to refresh access token.");
          }
        } else {
          console.error("Error fetching delivery data:", err);
          setIsLoading(false);
        }
      }
    };

    getDelivery();
  }, []);

  const convertToDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    return `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
  };

  const filteredProducts = delivery.filter(
    (product) =>
      product.payment.stripePaymentIntentId
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      product.user.fname.toLowerCase().includes(searchText.toLowerCase()) ||
      product.user.mobilenumber
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      product.orderStatus.toLowerCase().includes(searchText.toLowerCase())
  );

  const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="flex flex-col my-5">
        <div className="-my-2">
          <div className="py-2 w-11/12 m-auto">
            <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
              <div className="flex justify-between items-center px-6 py-3">
                <input
                  type="text"
                  placeholder="Search by user..."
                  className="px-4 py-2 border rounded-lg"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <div>Page {currentPage}</div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Delivery
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="flex justify-center py-4">
                        <TailSpin color="#007BFF" size={40} />
                      </td>
                    </tr>
                  ) : displayedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-xl py-4">
                        No Delivery's found.
                      </td>
                    </tr>
                  ) : (
                    displayedProducts.map((val, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {index + 1}-
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {val.user.fname} {val.user.lname}
                              </div>
                              <div className="text-sm text-gray-500">
                                {val.user.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                {val.user.mobilenumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {val.shoe.map((shoeArray, shoeIndex) => (
                            <div
                              className={`flex items-center gap-2 ${
                                shoeArray.length > 1
                                  ? "mb-2 p-2"
                                  : "border-none"
                              }`}
                              key={shoeIndex}
                            >
                              {shoeIndex + 1}-
                              {shoeArray.map((shoeVal, index) => (
                                <div
                                  className="text-sm text-gray-500"
                                  key={index}
                                >
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={shoeVal.productimg[1]}
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-900">
                                      {shoeVal.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {shoeVal.producer}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      Color: {shoeVal.color}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      Size: {shoeVal.size}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                      Qty: {shoeVal.quantity}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {val.orderStatus === "pending" ? (
                            <span
                              className="px-2 inline-flex text-xs leading-5
                              font-semibold rounded-full bg-yellow-300 text-black"
                            >
                              {val.orderStatus}
                            </span>
                          ) : val.orderStatus === "progress" ? (
                            <span
                              className="px-2 inline-flex text-xs leading-5
                                font-semibold rounded-full bg-green-100 text-green-800"
                            >
                              {val.orderStatus}
                            </span>
                          ) : val.orderStatus === "shipped" ? (
                            <span
                              className="px-2 inline-flex text-xs leading-5
                                  font-semibold rounded-full bg-blue-500 text-white"
                            >
                              {val.orderStatus}
                            </span>
                          ) : (
                            <span
                              className="px-2 inline-flex text-xs leading-5
                            font-semibold rounded-full bg-red-500 text-white"
                            >
                              {val.orderStatus}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="text-sm text-gray-900">
                            <span className="font-bold">Pay: </span>
                            {val.payment.paymentMethod}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-bold">Status: </span>
                            {val.payment.paymentStatus}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-bold">Code: </span>
                            {val.payment.stripePaymentIntentId}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-bold">Amount: </span>
                            {val.totalPrice}$
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-bold">Date: </span>
                            {convertToDate(val.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium text-left">
                          <div className="text-sm text-gray-900">
                            <span className="font-bold">Country: </span>
                            {val.country}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-bold">City: </span>
                            {val.city}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-bold">Province: </span>
                            {val.province}
                          </div>

                          <div className="text-sm text-gray-900">
                            <span className="font-bold">Building: </span>
                            {val.building}
                          </div>
                          <div className="text-sm text-gray-900">
                            <span className="font-bold">
                              Delivery Address:{" "}
                            </span>
                            {val.deliveryAddress}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <EditStatus orderId={val._id} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {pageCount > 1 && (
                <div className="flex justify-center items-center my-4">
                  <button
                    className="px-4 py-2 border rounded-lg"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="mx-4">
                    Page {currentPage} of {pageCount}
                  </span>
                  <button
                    className="px-4 py-2 border rounded-lg"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pageCount}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
