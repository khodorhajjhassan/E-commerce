import { useEffect, useState } from "react";
import DataTable from "../../../components/dataTable/DataTable.jsx";
import axios from "axios";
import Add from "../../../components/add/Add.jsx";
import "./category.scss";
import { RotatingLines } from "react-loader-spinner";
import { refreshAccessToken } from "../../../utils/refreshAccessToken.js";
const columns = [
  { field: "id", headerName: "ID", width: 150 },
  {
    field: "name",
    headerName: "Name",
    width: 250,
  },
  {
    field: "subcategories",
    headerName: "Subcategories",
    width: 500,
    renderCell: (params) => {
      const subcategories = params.value
        .map((subcategory) => subcategory.name)
        .join(", ");
      return <span>{subcategories}</span>;
    },
  },
  {
    field: "subsubcategories",
    headerName: "SubSubcategories",
    width: 500,
    renderCell: (params) => {
      const subsubcategories = params.row.subcategories
        .flatMap((subcategory) => subcategory.subsubcategories)
        .join(", ");
      return <span>{subsubcategories}</span>;
    },
  },
];

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlecategoryUpdate = (updatedCategories) => {
    setCategories(updatedCategories);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/category");
        const modifiedCategories = response.data.map((category) => ({
          id: category._id, // Use _id as id
          ...category,
        }));
        setCategories(modifiedCategories);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Access token expired, try to refresh the token
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const response = await axios.get(
                "http://localhost:8000/category",
                {
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                }
              );
              const modifiedCategories = response.data.map((category) => ({
                id: category._id, // Use _id as id
                ...category,
              }));
              setCategories(modifiedCategories);
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
    <div className="categories">
      <div className="info">
        <h1>Category</h1>
        <button onClick={() => setOpen(true)}>Add New Category</button>
      </div>

      {isLoading ? (
        <div className="loader-container flex justify-center items-center">
          <RotatingLines height={80} width={100} />
        </div>
      ) : categories.length === 0 ? (
        <div>No categories found.</div>
      ) : (
        <DataTable
          slug="category"
          columns={columns}
          rows={categories}
          setRows={setCategories}
        />
      )}

      {open && (
        <Add
          slug="category"
          setCategories={handlecategoryUpdate}
          categories={categories}
          columns={columns}
          setOpen={setOpen}
        />
      )}
    </div>
  );
};

export default Category;
