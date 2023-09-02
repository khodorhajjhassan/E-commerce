import React, { useState, useEffect } from "react";
import axios from "axios";
import NavLinks from "./NavLinks.jsx"; // Assuming this is the updated NavLinks component

const Categories = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch the category data from the server
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/category");
        setCategoryData(response.data);
        //console.log("thisisthedata",response.data)// Assuming the data received from the server is an array of categories
        setIsLoading(false);
      } catch (error) {
        setError("Error fetching category data.");
        setIsLoading(false);
      }
    };

    // Call the fetchCategoryData function to fetch the data when the component mounts
    fetchCategoryData();
  }, []);

  const handleNavClick = () => {
    // Your click handler logic here
    // For example, you can do something when a link in the navigation is clicked
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <NavLinks
          categories={transformData(categoryData)}
          handelClick={handleNavClick}
        />
      )}
    </div>
  );
};

// Helper function to transform the data received from the server to match the structure of the links data
const transformData = (dataFromDatabase) => {
  return dataFromDatabase.map((category) => ({
    name: category.name,
    submenu: true,
    sublinks: category.subcategories.map((subcategory) => ({
      Head: subcategory.name,
      sublink: subcategory.subsubcategories.map((subsubcategory) => ({
        name: subsubcategory,
        link: "/", // Replace this with the appropriate link for each subsubcategory
      })),
    })),
  }));
};

export default Categories;
