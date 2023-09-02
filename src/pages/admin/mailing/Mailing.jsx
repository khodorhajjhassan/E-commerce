import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import DataTable from "../../../components/dataTable/DataTable.jsx";
import apiToken from "../../../redux/apiToken.js";
import "./mailing.scss";
import { refreshAccessToken } from "../../../utils/refreshAccessToken.js";
const columns = [
  { field: "id", headerName: "ID", width: 250 },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 250,
  },
];

const Mailing = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiToken.get("http://localhost:8000/mailing", {
          withCredentials: true,
        });
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
  const handleSend = () => {
    const emailList = payments.map((payment) => payment.email).join(",");
    console.log(emailList);
    const gmailLink = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${encodeURIComponent(
      emailList
    )}`;
    window.location.href = gmailLink;
  };
  return (
    <div className="mailing">
      <div className="info flex gap-3">
        <h1>Mailing</h1>
        <button onClick={handleSend}>Send Offer To Emails</button>
      </div>
      {isLoading ? (
        <div className="loader-container flex justify-center items-center">
          <RotatingLines height={80} width={100} />
        </div>
      ) : payments.length === 0 ? (
        <div>No payments found.</div>
      ) : (
        <DataTable
          slug="mailing"
          columns={columns}
          rows={payments}
          setRows={setPayments}
        />
      )}
    </div>
  );
};

export default Mailing;
