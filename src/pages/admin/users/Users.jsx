import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import Add from "../../../components/add/Add";
import DataTable from "../../../components/dataTable/DataTable";
import apiToken from "../../../redux/apiToken";
import { refreshAccessToken } from "../../../utils/refreshAccessToken.js";
import "./users.scss";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "profileimg",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.profileimg || "/noavatar.png"} alt="" />;
    },
  },

  {
    field: "fname",
    type: "string",
    headerName: "First name",
    width: 100,
  },
  {
    field: "lname",
    type: "string",
    headerName: "Last name",
    width: 100,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },
  {
    field: "mobilenumber",
    type: "string",
    headerName: "Phone",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 120,
    type: "string",
  },
  {
    field: "isVerified",
    headerName: "Verified",
    width: 100,
    type: "boolean",
  },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiToken.get("/user/allusers", {
          withCredentials: true,
        });
        const modifiedUsers = response.data.map((user) => ({
          id: user._id, // Use _id as id
          ...user,
        }));
        setUsers(modifiedUsers);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Access token expired, try to refresh the token

          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const response = await apiToken.get("/user/allusers", {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });
              const modifiedUsers = response.data.map((user) => ({
                id: user._id, // Use _id as id
                ...user,
              }));
              setUsers(modifiedUsers);
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
    <div className="users">
      <div className="info">
        <h1>Users</h1>
      </div>

      {isLoading ? (
        <div className="loader-container flex justify-center items-center">
          <RotatingLines height={80} width={100} />
        </div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <DataTable
          slug="users"
          columns={columns}
          rows={users}
          setRows={setUsers}
        />
      )}

      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Users;
