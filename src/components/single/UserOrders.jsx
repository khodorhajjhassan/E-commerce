import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 4;

const UserOrders = ({ userOrders }) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (userOrders) {
      const filtered = userOrders.filter(
        (order) =>
          order.payment.toLowerCase().includes(searchText.toLowerCase()) ||
          order._id.toLowerCase().includes(searchText.toLowerCase()) ||
          order.quantity === parseInt(searchText) ||
          order.shoe.some((shoeArray) =>
            shoeArray.some(
              (shoe) =>
                (shoe.color &&
                  shoe.color
                    .toLowerCase()
                    .includes(searchText.toLowerCase())) ||
                shoe.quantity === parseInt(searchText) ||
                shoe.size === parseInt(searchText)
            )
          )
      );
      setFilteredOrders(filtered);
    }
  }, [userOrders, searchText]);

  const pageCount = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="flex flex-col my-5">
        <div className="-my-2">
          <div className="py-2 w-11/12 m-auto">
            <div className="bg-white shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
              <div className="flex justify-between items-center px-6 py-3">
                <input
                  type="text"
                  placeholder="Search by user..."
                  className="text-black px-4 py-2 border rounded-lg"
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
                      OrderID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Shoe Info
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      IMG
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      PaymentID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      PurchasedAt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-black">
                  {filteredOrders.length === 0 ? ( // Check if there are no orders
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No Orders found here
                      </td>
                    </tr>
                  ) : (
                    // Render orders
                    displayedProducts.map((order, index) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${order.totalPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.shoe.map((shoe, shoeIndex) => (
                            <div key={shoeIndex}>
                              Color: {shoe[0].color}
                              <br />
                              Size: {shoe[0].size}
                              <br />
                              Quantity: {shoe[0].quantity}
                              <br />
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.shoe.map((shoe, shoeIndex) => (
                            <div key={shoeIndex}>
                              <img
                                src={shoe[0].productimg[0]}
                                alt={`Product ${index + 1}`}
                                className="h-12 w-12 object-cover "
                              />
                            </div>
                          ))}
                        </td>
                        <td className="px-6">{order.payment}</td>
                        <td>{order.createdAt.split("T")[0]}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {pageCount > 1 && (
                <div className="flex justify-center items-center my-4 ">
                  <button
                    className="text-black px-4 py-2 border rounded-lg"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="mx-4">
                    Page {currentPage} of {pageCount}
                  </span>
                  <button
                    className="text-black px-4 py-2 border rounded-lg"
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

export default UserOrders;
