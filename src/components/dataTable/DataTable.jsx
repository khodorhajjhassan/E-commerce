import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { NavLink } from "react-router-dom";
import apiToken from "../../redux/apiToken";
import { refreshAccessToken } from "../../utils/refreshAccessToken";
import "./dataTable.scss";

const DataTable = (props) => {
  const handleAccept = async (id) => {
    try {
      await apiToken.put(
        `/order/${id}`,
        { RefundRequest: "accepted" },
        { withCredentials: true }
      );
      props.setRows((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, RefundRequest: "accepted" } : order
        )
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Access token expired, try to refresh the token
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retry the API request with the new access token
          try {
            await axios.put(
              `http://localhost:8000/order/${id}`,
              { RefundRequest: "accepted" },
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              }
            );

            props.setRows((prevOrders) =>
              prevOrders.map((order) =>
                order.id === id
                  ? { ...order, RefundRequest: "accepted" }
                  : order
              )
            );
          } catch (error) {
            console.error("Error Updating Refund:", error);
          }
        } else {
          console.error("Failed to refresh access token.");
        }
      } else {
        console.error("Error Updating Refund:", error);
      }
    }
  };

  const handleDecline = async (id) => {
    try {
      await apiToken.put(
        `/order/${id}`,
        { RefundRequest: "declined" },
        { withCredentials: true }
      );
      props.setRows((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, RefundRequest: "declined" } : order
        )
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Access token expired, try to refresh the token
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retry the API request with the new access token
          try {
            await axios.put(
              `http://localhost:8000/order/${id}`,
              { RefundRequest: "declined" },
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              }
            );
            props.setRows((prevOrders) =>
              prevOrders.map((order) =>
                order.id === id
                  ? { ...order, RefundRequest: "declined" }
                  : order
              )
            );
          } catch (error) {
            console.error("Error Updating Refund:", error);
          }
        } else {
          console.error("Failed to refresh access token.");
        }
      } else {
        console.error("Error Updating Refund:", error);
      }
    }
  };
  let endpoint;
  //console.log("my props=>",props)
  const handleDelete = async (id) => {
    try {
      switch (props.slug) {
        case "users":
          endpoint = "user";
          break;
        case "products":
          endpoint = "shoe";
          break;
        case "orders":
          endpoint = "order";
          break;
        case "category":
          endpoint = "category";
          break;
        case "payments":
          endpoint = "payment";
          break;
        case "logs":
          endpoint = "auth";
          break;
        case "visits":
          endpoint = "visteduser";
          break;

        default:
          throw new Error(`Invalid prop slug: ${props.slug}`);
      }

      await axios.delete(`http://localhost:8000/${endpoint}/${id}`, {
        withCredentials: true,
      });

      const updatedRows = props.rows.filter((row) => row.id !== id);
      props.setRows(updatedRows);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Access token expired, try to refresh the token
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retry the API request with the new access token
          try {
            await axios.delete(`http://localhost:8000/${endpoint}/${id}`, {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
              withCredentials: true,
            });

            const updatedRows = props.rows.filter((row) => row.id !== id);
            props.setRows(updatedRows);
          } catch (error) {
            console.error("Error deleting Value:", error);
          }
        } else {
          console.error("Failed to refresh access token.");
        }
      } else {
        console.error("Error deleting Value:", error);
      }
    }
  };

  const actionColumn = {
    field: "action",
    headername: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          {props.slug !== "orders" &&
            props.slug !== "refunds" &&
            props.slug !== "category" &&
            props.slug !== "payments" &&
            props.slug !== "logs" &&
            props.slug !== "visits" &&
            props.slug !== "mailing" && (
              <NavLink to={`/admin/${props.slug}/${params.row.id}`}>
                <img src="/view.svg" alt="" />
              </NavLink>
            )}
          {props.slug !== "refunds" && props.slug !== "mailing" && (
            <div className="delete" onClick={() => handleDelete(params.row.id)}>
              <img src="/delete.svg" alt="" />
            </div>
          )}
          {props.slug === "refunds" && (
            <div className="Refund" onClick={() => handleAccept(params.row.id)}>
              <img src="/refund.png" alt="accept" />
            </div>
          )}

          {props.slug === "refunds" && (
            <div
              className="Refundx"
              onClick={() => handleDecline(params.row.id)}
            >
              <img src="/refundx.svg" alt="decline" />
            </div>
          )}
        </div>
      );
    },
  };
  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[
          ...props.columns,
          props.slug != "mailing" ? actionColumn : [],
        ]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            csvOptions: {
              fileName: "FootVibe",
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
