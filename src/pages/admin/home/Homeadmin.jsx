import "./home.scss";

import { useEffect, useState } from "react";
import BarChartBox from "../../../components/barChartBox/BarChartBox";
import BigChartBox from "../../../components/bigChartBox/BigChartBox";
import ChartBox from "../../../components/chartBox/ChartBox";
import PieChartBox from "../../../components/pieCartBox/PieChartBox";
import TopBox from "../../../components/topBox/TopBox";
import {
  chartBoxConversion,
  chartBoxProduct as initialChartBoxProduct,
  chartBoxRevenue as initialChartBoxRevenue,
  chartBoxUser as initialChartBoxUser,
  barChartBoxRevenue as initialbarChartBoxRevenue,
} from "../../../data";
import apiToken from "../../../redux/apiToken.js";
import { refreshAccessToken } from "../../../utils/refreshAccessToken";
import { Loadinganimation } from "./Loadinganimation";

function getWeekBounds(date) {
  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  return { startDate, endDate };
}

const getColorForDeviceType = (deviceType) => {
  const colorMap = {
    mobile: "#0088FE",
    desktop: "#00C49F",
    laptop: "#FFBB28",
    tablet: "#FF8042",
  };
  return colorMap[deviceType.toLowerCase()] || "#000000";
};

const Homeadmin = () => {
  const [TopDeals, setTopDeals] = useState([]);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [chartBoxUsers, setChartBoxUsers] = useState(initialChartBoxUser);
  const [chartBoxProducts, setChartBoxProducts] = useState(
    initialChartBoxProduct
  );
  const [chartBoxRevenues, setChartBoxRevenues] = useState(
    initialChartBoxRevenue
  );
  const [barChartBoxRevenues, setBarChartBoxRevenues] = useState(
    initialbarChartBoxRevenue
  );
  const [bigChartBoxs, setBigChartBox] = useState([]);
  const [PieChartBoxs, setPieChartBoxs] = useState([]);
  const [barChartBoxVisit, setBarChartBoxVisit] = useState([]);
  useEffect(() => {
    const fetchTopDeals = async () => {
      try {
        const response = await apiToken.get(
          "http://localhost:8000/payment/delivery",
          { withCredentials: true }
        );
        const fetchedData = response.data;

        fetchedData.sort((a, b) => b.totalPrice - a.totalPrice);
        const topData = fetchedData.slice(0, 7);
        setTopDeals(topData);
        setIsLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Access token expired, try to refresh the token
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const response = await apiToken.get(
                "http://localhost:8000/payment/delivery",
                {
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                  withCredentials: true,
                }
              );
              const fetchedData = response.data;

              fetchedData.sort((a, b) => b.totalPrice - a.totalPrice);
              const topData = fetchedData.slice(0, 7);
              setTopDeals(topData);
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
          setError(err);
          setIsLoading(false);
        }
      }
    };

    const fetchUserData = async () => {
      try {
        const usersData = await apiToken.get("/user/allusers", {
          withCredentials: true,
        });
        const userCounts = usersData.data.length;
        const currentDate = new Date();

        const currentMonth = currentDate.getMonth();
        const usersInCurrentMonth = usersData.data.filter(
          (user) => new Date(user.createdAt).getMonth() === currentMonth
        ).length;

        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const usersInPreviousMonth = usersData.data.filter(
          (user) => new Date(user.createdAt).getMonth() === previousMonth
        ).length;

        const increasePercentage = Math.round(
          ((usersInCurrentMonth - usersInPreviousMonth) /
            usersInPreviousMonth) *
            100
        );

        setChartBoxUsers((prevChartBoxUser) => ({
          ...prevChartBoxUser,
          number: userCounts,
          percentage: increasePercentage,
        }));
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            try {
              const usersData = await apiToken.get("/user/allusers", {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });
              const userCounts = usersData.data.length;
              const currentDate = new Date();

              const currentMonth = currentDate.getMonth();
              const usersInCurrentMonth = usersData.data.filter(
                (user) => new Date(user.createdAt).getMonth() === currentMonth
              ).length;

              const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
              const usersInPreviousMonth = usersData.data.filter(
                (user) => new Date(user.createdAt).getMonth() === previousMonth
              ).length;

              const increasePercentage = Math.round(
                ((usersInCurrentMonth - usersInPreviousMonth) /
                  usersInPreviousMonth) *
                  100
              );

              setChartBoxUsers((prevChartBoxUser) => ({
                ...prevChartBoxUser,
                number: userCounts,
                percentage: increasePercentage,
              }));
            } catch (error) {
              console.error("Error fetching user data:", error);
              setError(error);
            }
          } else {
            console.error("Failed to refresh access token.");
          }
        } else {
          setError(err);
        }
      }
    };

    const fetchProductData = async () => {
      try {
        const ProductData = await apiToken.get("/shoe/allproducts", {
          withCredentials: true,
        });

        const ProductCounts = ProductData.data.length;
        const currentDate = new Date();
        const lastUpdatedDate = new Date(ProductData.data[0].updatedAt);

        const currentMonth = currentDate.getMonth();
        const productsInCurrentMonth = ProductData.data.filter(
          (product) => new Date(product.createdAt).getMonth() === currentMonth
        ).length;

        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const productsInPreviousMonth = ProductData.data.filter(
          (product) => new Date(product.createdAt).getMonth() === previousMonth
        ).length;

        const increasePercentage = Math.round(
          ((productsInCurrentMonth - productsInPreviousMonth) /
            (productsInPreviousMonth === 0 ? 1 : productsInPreviousMonth)) *
            100
        );

        setChartBoxProducts((prevChartBoxProduct) => ({
          ...prevChartBoxProduct,
          number: ProductCounts,
          percentage: increasePercentage,
        }));
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Access token expired, try to refresh the token
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const ProductData = await apiToken.get("/shoe/allproducts", {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });
              const ProductCounts = ProductData.data.length;
              const currentDate = new Date();

              const currentMonth = currentDate.getMonth();
              const productsInCurrentMonth = ProductData.data.filter(
                (product) =>
                  new Date(product.createdAt).getMonth() === currentMonth
              ).length;

              const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
              const productsInPreviousMonth = ProductData.data.filter(
                (product) =>
                  new Date(product.createdAt).getMonth() === previousMonth
              ).length;

              const increasePercentage = Math.round(
                ((productsInCurrentMonth - productsInPreviousMonth) /
                  (productsInPreviousMonth === 0
                    ? 1
                    : productsInPreviousMonth)) *
                  100
              );

              setChartBoxProducts((prevChartBoxProduct) => ({
                ...prevChartBoxProduct,
                number: ProductCounts,
                percentage: increasePercentage,
              }));
            } catch (error) {
              console.error("Error fetching product data:", error);
              setError(error);
            }
          } else {
            console.error("Failed to refresh access token.");
            // Handle the scenario when the refresh token is also expired, e.g., redirect to the login page.
          }
        } else {
          setError(err);
        }
      }
    };

    const fetchOrderData = async () => {
      try {
        const OrderData = await apiToken.get("/order/allorders", {
          withCredentials: true,
        });

        if (OrderData.data) {
          const orders = OrderData.data;
          const currentDate = new Date();
          const lastMonth = new Date(currentDate);

          lastMonth.setMonth(currentDate.getMonth() - 1);

          let lastMonthTotal = 0;
          let thisMonthTotal = 0;
          let totalSum = 0;
          const aggregatedData = {};
          const dailyProfit = [0, 0, 0, 0, 0, 0, 0];
          orders.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            const dayOfWeek = orderDate.getDay();
            const dayName = orderDate.toLocaleDateString("en-US", {
              weekday: "short",
            });
            dailyProfit[dayOfWeek] += order.totalPrice;
            totalSum += order.totalPrice;

            if (orderDate >= lastMonth && orderDate <= currentDate) {
              if (orderDate.getMonth() === lastMonth.getMonth()) {
                lastMonthTotal += order.totalPrice;
              } else if (orderDate.getMonth() === currentDate.getMonth()) {
                thisMonthTotal += order.totalPrice;
              }
            }
            order.shoe.forEach((shoeItem) => {
              shoeItem.forEach((shoe) => {
                const category = shoe.category[0];

                if (!aggregatedData[dayName]) {
                  aggregatedData[dayName] = { name: dayName };
                }

                if (!aggregatedData[dayName][category]) {
                  aggregatedData[dayName][category] = 0;
                }

                aggregatedData[dayName][category] +=
                  parseFloat(shoe.price) * shoe.quantity;
              });
            });
          });
          const data = Object.values(aggregatedData);
          setBigChartBox(data);

          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

          const chartData = dayNames.map((dayName, index) => ({
            name: dayName,
            profit: dailyProfit[index],
          }));
          console.log(thisMonthTotal);
          console.log(lastMonthTotal);
          console.log(lastMonthTotal === 0 ? 1 : lastMonthTotal);
          const percentageIncrease =
            ((thisMonthTotal - lastMonthTotal) /
              (lastMonthTotal === 0 ? 1 : lastMonthTotal)) *
            100;
          setChartBoxRevenues((prevChartBoxRevenue) => ({
            ...prevChartBoxRevenue,
            number: totalSum,
            percentage: percentageIncrease,
          }));

          setBarChartBoxRevenues((prevBarChartBoxRevenues) => ({
            ...prevBarChartBoxRevenues,
            chartData: chartData,
          }));
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          const newAccessToken = await refreshAccessToken();

          if (newAccessToken) {
            try {
              const OrderData = await apiToken.get("/order/allorders", {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });
              if (OrderData.data) {
                const orders = OrderData.data;
                const currentDate = new Date();
                const lastMonth = new Date(currentDate);

                lastMonth.setMonth(currentDate.getMonth() - 1);

                let lastMonthTotal = 0;
                let thisMonthTotal = 0;
                let totalSum = 0;
                const aggregatedData = {};
                const dailyProfit = [0, 0, 0, 0, 0, 0, 0];
                orders.forEach((order) => {
                  const orderDate = new Date(order.createdAt);
                  const dayOfWeek = orderDate.getDay();
                  const dayName = orderDate.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  dailyProfit[dayOfWeek] += order.totalPrice;
                  totalSum += order.totalPrice;

                  if (orderDate >= lastMonth && orderDate <= currentDate) {
                    if (orderDate.getMonth() === lastMonth.getMonth()) {
                      lastMonthTotal += order.totalPrice;
                    } else if (
                      orderDate.getMonth() === currentDate.getMonth()
                    ) {
                      thisMonthTotal += order.totalPrice;
                    }
                  }
                  order.shoe.forEach((shoeItem) => {
                    shoeItem.forEach((shoe) => {
                      const category = shoe.category[0];

                      if (!aggregatedData[dayName]) {
                        aggregatedData[dayName] = { name: dayName };
                      }

                      if (!aggregatedData[dayName][category]) {
                        aggregatedData[dayName][category] = 0;
                      }

                      aggregatedData[dayName][category] +=
                        parseFloat(shoe.price) * shoe.quantity;
                    });
                  });
                });
                const data = Object.values(aggregatedData);
                setBigChartBox(data);

                const dayNames = [
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ];

                const chartData = dayNames.map((dayName, index) => ({
                  name: dayName,
                  profit: dailyProfit[index],
                }));
                const percentageIncrease =
                  ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
                setChartBoxRevenues((prevChartBoxRevenue) => ({
                  ...prevChartBoxRevenue,
                  number: totalSum,
                  percentage: percentageIncrease,
                }));

                setBarChartBoxRevenues((prevBarChartBoxRevenues) => ({
                  ...prevBarChartBoxRevenues,
                  chartData: chartData,
                }));
              }
            } catch (error) {
              console.error("Error fetching order data:", error);
            }
          } else {
            console.error("Failed to refresh access token.");
            // Handle the scenario when the refresh token is also expired, e.g., redirect to the login page.
          }
        } else {
          setError(err);
        }
      }
    };

    const fetchVistedUserData = async () => {
      try {
        const VistedUserData = await apiToken.get("/visteduser", {
          withCredentials: true,
        });
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const deviceTypeCounts = VistedUserData.data.reduce((counts, item) => {
          const deviceType = item.deviceType.toLowerCase();
          counts[deviceType] = (counts[deviceType] || 0) + 1;
          return counts;
        }, {});

        const transformedData = Object.keys(deviceTypeCounts).map(
          (deviceType) => ({
            name: deviceType.charAt(0).toUpperCase() + deviceType.slice(1),
            value: deviceTypeCounts[deviceType],
            color: getColorForDeviceType(deviceType),
          })
        );

        setPieChartBoxs(transformedData);

        const chartData = daysOfWeek.map((day) => {
          const dayVisits = VistedUserData.data.filter((item) => {
            const visitedDate = new Date(item.visitedAt);
            const { startDate, endDate } = getWeekBounds(visitedDate);

            return (
              daysOfWeek[visitedDate.getDay()] === day &&
              visitedDate >= startDate &&
              visitedDate <= endDate
            );
          });

          return {
            name: day,
            visit: dayVisits.length,
          };
        });

        const transformedDatas = {
          title: "Total Visit",
          color: "#FF8042",
          dataKey: "visit",
          chartData: chartData,
        };
        setBarChartBoxVisit(transformedDatas);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Access token expired, try to refresh the token
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              const VistedUserData = await apiToken.get("/visteduser", {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });
              const daysOfWeek = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ];
              const deviceTypeCounts = VistedUserData.data.reduce(
                (counts, item) => {
                  const deviceType = item.deviceType.toLowerCase();
                  counts[deviceType] = (counts[deviceType] || 0) + 1;
                  return counts;
                },
                {}
              );

              const transformedData = Object.keys(deviceTypeCounts).map(
                (deviceType) => ({
                  name:
                    deviceType.charAt(0).toUpperCase() + deviceType.slice(1),
                  value: deviceTypeCounts[deviceType],
                  color: getColorForDeviceType(deviceType),
                })
              );

              setPieChartBoxs(transformedData);

              const chartData = daysOfWeek.map((day) => {
                const dayVisits = VistedUserData.data.filter((item) => {
                  const visitedDate = new Date(item.visitedAt);
                  const { startDate, endDate } = getWeekBounds(visitedDate);

                  return (
                    daysOfWeek[visitedDate.getDay()] === day &&
                    visitedDate >= startDate &&
                    visitedDate <= endDate
                  );
                });

                return {
                  name: day,
                  visit: dayVisits.length,
                };
              });

              const transformedDatas = {
                title: "Total Visit",
                color: "#FF8042",
                dataKey: "visit",
                chartData: chartData,
              };
              setBarChartBoxVisit(transformedDatas);
            } catch (error) {
              console.error("Error fetching visited user data:", error);
              setError(error);
            }
          } else {
            console.error("Failed to refresh access token.");
            // Handle the scenario when the refresh token is also expired, e.g., redirect to the login page.
          }
        } else {
          setError(err);
        }
      }
    };

    fetchVistedUserData();
    fetchUserData();
    fetchTopDeals();
    fetchOrderData();
    fetchProductData();
  }, []);

  return (
    <div className="home">
      <div className={` ${isLoading ? "box1" : "box box1"}`}>
        {isLoading ? <Loadinganimation /> : <TopBox TopDeals={TopDeals} />}
      </div>
      <div className={` ${isLoading ? "box2" : "box box2"}`}>
        {isLoading ? <Loadinganimation /> : <ChartBox {...chartBoxUsers} />}
      </div>
      <div className={` ${isLoading ? "box3" : "box box3"}`}>
        {isLoading ? <Loadinganimation /> : <ChartBox {...chartBoxProducts} />}
      </div>
      <div className={` ${isLoading ? "box4" : "box box4"}`}>
        {isLoading ? <Loadinganimation /> : <PieChartBox {...PieChartBoxs} />}
      </div>
      <div className={` ${isLoading ? "box5" : "box box5"}`}>
        {isLoading ? (
          <Loadinganimation />
        ) : (
          <ChartBox {...chartBoxConversion} />
        )}
      </div>
      <div className={` ${isLoading ? "box6" : "box box6"}`}>
        {isLoading ? <Loadinganimation /> : <ChartBox {...chartBoxRevenues} />}
      </div>
      <div className={` ${isLoading ? "box7" : "box box7"}`}>
        {isLoading ? <Loadinganimation /> : <BigChartBox {...bigChartBoxs} />}
      </div>
      <div className={` ${isLoading ? "box8" : "box box8"}`}>
        {isLoading ? (
          <Loadinganimation />
        ) : (
          <BarChartBox {...barChartBoxVisit} />
        )}
      </div>
      <div className={` ${isLoading ? "box9" : "box box9"}`}>
        {isLoading ? (
          <Loadinganimation />
        ) : (
          <BarChartBox {...barChartBoxRevenues} />
        )}
      </div>
    </div>
  );
};

export default Homeadmin;
