import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import DataTable from "../../../components/dataTable/DataTable.jsx";
import apiToken from "../../../redux/apiToken.js";
import { refreshAccessToken } from "../../../utils/refreshAccessToken.js";
import "./orders.scss";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "shoe",
    type: "string",
    headerName: "Product_id",
    width: 350,
  },
  {
    field: "user",
    type: "string",
    headerName: "User_id",
    width: 150,
  },
  {
    field: "quantity",
    type: "string",
    headerName: "Quantity",
    width: 200,
  },
  {
    field: "totalPrice",
    headerName: "TotalPrice",
    type: "string",
    width: 150,
  },
  {
    field: "orderStatus",
    headerName: "OrderStatus",
    width: 150,
    type: "string",
  },
  {
    field: "deliveryAddress",
    headerName: "Address",
    width: 200,
    type: "string",
  },
  {
    field: "RefundRequest",
    headerName: "RefundRequest",
    width: 200,
    type: "string",
  },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiToken.get("/order/allorders", {
          withCredentials: true,
        });
        const modifiedOrders = response.data.map((order) => {
          const flattenedShoeArray = order.shoe.flat();
          const shoeIds = flattenedShoeArray.map((shoe) => shoe._id).join(", ");

          return {
            id: order._id,
            ...order,
            shoe: shoeIds,
          };
        });
        setOrders(modifiedOrders);
        console.log(modifiedOrders);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Access token expired, try to refresh the token
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const response = await axios.get(
                "http://localhost:8000/order/allorders",
                {
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                  withCredentials: true,
                }
              );
              const modifiedOrders = response.data.map((order) => ({
                id: order._id, // Use _id as id
                ...order,
              }));
              setOrders(modifiedOrders);
              setIsLoading(false);
            } catch (error) {
              console.error("Error fetching data:", error);
              setIsLoading(false);
            }
          } else {
            console.error("Failed to refresh access token.");
            // Handle the scenario when the refresh token is also expired, e.g., redirect to the login page.
          }
        } else {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="orders">
      <div className="info">
        <h1>Orders</h1>
      </div>
      {isLoading ? (
        <div className="loader-container flex justify-center items-center">
          <RotatingLines height={80} width={100} />
        </div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <DataTable
          slug="orders"
          columns={columns}
          rows={orders}
          setRows={setOrders}
        />
      )}
    </div>
  );
};

export default Orders;
