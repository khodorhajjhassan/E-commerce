import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import Add from "../../../components/add/Add.jsx";
import DataTable from "../../../components/dataTable/DataTable";
import apiToken from "../../../redux/apiToken.js";
import { refreshAccessToken } from "../../../utils/refreshAccessToken.js";
import "./products.scss";

const columns = [
  { field: "id", headerName: "ID", width: 180 },
  {
    field: "productimg",
    headerName: "Image",
    type: "image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.productimg[0] || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "productimgtwo",
    headerName: "Image2",
    type: "image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.productimg[1] || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "productimgthree",
    headerName: "Image3",
    type: "image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.productimg[2] || "/noavatar.png"} alt="" />;
    },
  },
  {
    field: "name",
    type: "string",
    headerName: "Title",
    width: 250,
  },
  {
    field: "category",
    type: "string",
    headerName: "Category",
    width: 80,
  },
  {
    field: "subcategory",
    type: "string",
    headerName: "Subcategory",
    width: 150,
  },
  {
    field: "subsubcategory",
    type: "string",
    headerName: "Subsubcategory",
    width: 150,
  },

  {
    field: "price",
    type: "float",
    headerName: "Price",
    width: 100,
  },
  {
    field: "producer",
    headerName: "Producer",
    type: "string",
    width: 100,
  },
  {
    field: "discount",
    headerName: "Discount",
    type: "number",
    width: 80,
  },
  {
    field: "description",
    headerName: "Description",
    type: "string",
    width: 200,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
  {
    field: "color",
    headerName: "Color",
    width: 300,
    renderCell: (params) => {
      const colors = params.row.color; // Assuming "color" is an array of color objects

      if (colors && colors.length > 0) {
        return colors.map((color, index) => (
          <span key={index}>
            {`(${color.colorName}, `}
            {color.sizes.map((sizeInfo, sizeIndex) => (
              <span key={sizeIndex}>
                {sizeInfo.size}: {sizeInfo.quantity}
                {sizeIndex !== color.sizes.length - 1 ? ", " : ""}
              </span>
            ))}
            {`)`}
            {index !== colors.length - 1 ? ", " : ""}
          </span>
        ));
      } else {
        return "N/A";
      }
    },
  },
];

const Products = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiToken.get(
          "http://localhost:8000/shoe/allproducts",
          { withCredentials: true }
        );
        const modifiedProducts = response.data.map((product) => ({
          id: product._id, // Use _id as id
          ...product,
        }));
        setProducts(modifiedProducts);
        setIsLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Access token expired, try to refresh the token
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const response = await apiToken.get(
                "http://localhost:8000/shoe/allproducts",
                {
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                  withCredentials: true,
                }
              );
              const modifiedProducts = response.data.map((product) => ({
                id: product._id, // Use _id as id
                ...product,
              }));
              setProducts(modifiedProducts);
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
    <div className="products">
      <div className="info">
        <h1>Products</h1>
        <button onClick={() => setOpen(true)}>Add New Products</button>
      </div>

      {isLoading ? (
        <div className="loader-container flex justify-center items-center">
          <RotatingLines height={80} width={100} />
        </div>
      ) : products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <DataTable
          slug="products"
          columns={columns}
          rows={products}
          setRows={setProducts}
        />
      )}
      {open && <Add slug="product" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Products;
