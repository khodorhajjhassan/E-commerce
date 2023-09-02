import axios from "axios"; // Import Axios
import { useEffect, useState } from "react";

const NavLinksComponent = ({ handleClick }) => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the server using Axios
        const response = await axios.get("http://localhost:8000/categories"); // Replace "/api/categories" with the actual route to fetch categories from the server

        // Assuming the server returns the data in a property called "data"
        const categoriesData = response.data;

        // Map the data to match the desired structure
        const mappedCategories = categoriesData.map((category) => {
          const sublinks = category.subcategories.map((subcategory) => {
            return { Head: subcategory, sublink: [] };
          });
          return { name: category.name, submenu: true, sublinks };
        });

        setCategories(mappedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Rest of your component and rendering logic...
};

export default NavLinksComponent;
