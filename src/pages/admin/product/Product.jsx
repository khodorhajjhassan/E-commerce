import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Single from "../../../components/single/Single";
import apiToken from "../../../redux/apiToken";
import { refreshAccessToken } from "../../../utils/refreshAccessToken";
import "./product.scss";

const Product = () => {
  const params = useParams();
  const [productOrder, setOrderData] = useState({});
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiToken.get(`/shoe/q/${params.id}`, {
          withCredentials: true,
        });

        const productOrders = await apiToken.get(
          `/order/product/${params.id}`,
          {
            withCredentials: true,
          }
        );
        console.log("productOrders=>", productOrders.data);
        setOrderData(productOrders.data);

        setProductData({ ...response.data });
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Access token expired, try to refresh the token

          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const response = await apiToken.get(`/shoe/q/${params.id}`, {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });

              setProductData({ ...response.data });
              setLoading(false);
            } catch (error) {
              console.error("Error fetching shoe data:", error);
              setLoading(false);
            }
          } else {
            console.error("Failed to refresh access token.");
            // Handle the scenario when the refresh token is also expired, e.g., redirect to the login page.
          }
        } else {
          console.error("Error fetching shoe data:", error);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <div className="product">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Single
            product={"product"}
            {...productData}
            productOrder={productOrder}
          />
        </>
      )}
    </div>
  );
};

export default Product;
