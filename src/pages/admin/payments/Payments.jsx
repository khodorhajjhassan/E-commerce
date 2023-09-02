import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import DataTable from "../../../components/dataTable/DataTable.jsx";
import apiToken from "../../../redux/apiToken.js";
import { refreshAccessToken } from "../../../utils/refreshAccessToken.js";
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "shoe",
    type: "string",
    headerName: "Product_id",
    width: 250,
  },
  {
    field: "user",
    type: "string",
    headerName: "User_id",
    width: 150,
  },
  {
    field: "amount",
    type: "string",
    headerName: "TotalPaid",
    width: 100,
  },
  {
    field: "paymentMethod",
    headerName: "TotalPrice",
    type: "string",
    width: 150,
  },
  {
    field: "paymentStatus",
    headerName: "PaymentStatus",
    width: 150,
    type: "string",
  },
  {
    field: "stripePaymentIntentId",
    headerName: "PaymentID",
    width: 200,
    type: "string",
  },
];

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiToken.get(
          "http://localhost:8000/payment/allpayments",
          { withCredentials: true }
        );
        const modifiedPayments = response.data.map((payment) => ({
          id: payment._id, // Use _id as id
          ...payment,
        }));
        setPayments(modifiedPayments);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Access token expired, try to refresh the token
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const response = await apiToken.get(
                "http://localhost:8000/payment/allpayments",
                {
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                  withCredentials: true,
                }
              );
              const modifiedPayments = response.data.map((payment) => ({
                id: payment._id, // Use _id as id
                ...payment,
              }));
              setPayments(modifiedPayments);
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
    <div className="payments">
      <div className="info">
        <h1>Payments</h1>
      </div>
      {isLoading ? (
        <div className="loader-container flex justify-center items-center">
          <RotatingLines height={80} width={100} />
        </div>
      ) : payments.length === 0 ? (
        <div>No payments found.</div>
      ) : (
        <DataTable
          slug="payments"
          columns={columns}
          rows={payments}
          setRows={setPayments}
        />
      )}
    </div>
  );
};

export default Payments;
