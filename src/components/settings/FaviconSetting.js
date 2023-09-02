import React, { useState } from "react";
import "./FaviconSettings.scss";

const FaviconSetting = () => {
  const [selectedFavicon, setSelectedFavicon] = useState(null);

  // Function to handle file selection
  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    setSelectedFavicon(file);
  };

  // Function to handle form submission (if needed)
  const handleFaviconSave = (e) => {
    e.preventDefault();
    // Perform any additional logic or API calls related to favicon setting
    // For this example, we'll just log the selected favicon file
    //console.log(selectedFavicon);
  };

  return (
    <div className="favicon-settings-container">
      <h2>Favicon </h2>
      <form onSubmit={handleFaviconSave}>
        <label htmlFor="faviconInput">Select Favicon:</label>
        <input
          type="file"
          id="faviconInput"
          accept="image/*"
          onChange={handleFaviconChange}
        />
        {selectedFavicon && (
          <div className="favicon-preview">
            <p>Selected Favicon Preview:</p>
            <img
              src={URL.createObjectURL(selectedFavicon)}
              alt="Selected Favicon"
            />
          </div>
        )}
        <button type="submit">Save Favicon</button>
      </form>
    </div>
  );
};

export default FaviconSetting;
