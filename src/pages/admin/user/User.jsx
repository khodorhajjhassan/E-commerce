import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Single from "../../../components/single/Single";
import apiToken from "../../../redux/apiToken";
import { refreshAccessToken } from "../../../utils/refreshAccessToken";
import "./user.scss";
const User = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [userOrder, setOrderData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiToken.get(`/user/${id}`, {
          withCredentials: true,
        });
        const userOrders = await apiToken.get(`/order/user/${id}`, {
          withCredentials: true,
        });

        setOrderData(userOrders.data);
        //console.log("response=>",response)
        setUserData({ ...response.data });
        setLoading(false);
      } catch (error) {
        //console.log(error.response.status)
        if (error.response && error.response.status === 401) {
          // Access token expired, try to refresh the token

          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const response = await apiToken.get(`/user/${id}`, {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });
              setUserData({ ...response.data });
              setLoading(false);
            } catch (error) {
              console.error("Error fetching user data:", error);
              setLoading(false);
            }
          } else {
            console.error("Failed to refresh access token.");
            // Handle the scenario when the refresh token is also expired, e.g., redirect to the login page.
            setLoading(false);
          }
        } else {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div className="user ">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Single user={"user"} {...userData} userOrder={userOrder} />
        </>
      )}
    </div>
  );
};

export default User;
