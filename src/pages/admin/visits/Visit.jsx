import { useEffect, useState } from "react";
import DataTable from "../../../components/dataTable/DataTable.jsx";
//import './Logs.scss';
import { RotatingLines } from "react-loader-spinner";
import apiToken from "../../../redux/apiToken.js";
import { refreshAccessToken } from "../../../utils/refreshAccessToken.js";

const columns = [
  { field: "id", headerName: "ID", width: 200 },

  {
    field: "ipAddress",
    type: "number",
    headerName: "IpAddress",
    width: 80,
  },
  {
    field: "deviceType",
    type: "string",
    headerName: "DeviceType",
    width: 100,
  },
  {
    field: "country",
    type: "string",
    headerName: "Country",
    width: 120,
  },
  {
    field: "city",
    type: "string",
    headerName: "City",
    width: 100,
  },

  {
    field: "visitedAt",
    headerName: "VisitedAt",
    width: 150,
    type: "timestamp",
  },
];

const Logs = () => {
  // const [open,setOpen] = useState(false);
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiToken.get("/visteduser", {
          withCredentials: true,
        });
        const modifiedUsers = response.data.map((user) => ({
          id: user._id, // Use _id as id
          ...user,
        }));
        setVisits(modifiedUsers);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Access token expired, try to refresh the token

          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const response = await apiToken.get("/visteduser", {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });
              const modifiedUsers = response.data.map((user) => ({
                id: user._id, // Use _id as id
                ...user,
              }));
              setVisits(modifiedUsers);
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
    <div className="visits">
      <div className="info">
        <h1 className="mb-3">Visits</h1>
      </div>

      {isLoading ? (
        <div className="loader-container flex justify-center items-center">
          <RotatingLines height={80} width={100} />
        </div>
      ) : visits.length === 0 ? (
        <div>No Logs found.</div>
      ) : (
        <DataTable
          slug="visits"
          columns={columns}
          rows={visits}
          setRows={setVisits}
        />
      )}
    </div>
  );
};

export default Logs;
