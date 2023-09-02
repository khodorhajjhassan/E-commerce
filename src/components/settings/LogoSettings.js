import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LogoSettings.scss";

const LogoSettings = () => {
  const initialLogoUrl = localStorage.getItem("logoUrl") || "";
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await axios.get("http://localhost:8000/settings/logo");
      setLogoUrl(response.data.logoUrl);
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  const handleLogoChange = (e) => {
    setSelectedLogo(e.target.files[0]);
  };

  const handleLogoSave = async (e) => {
    e.preventDefault();

    if (!selectedLogo) {
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64Image = event.target.result;

      try {
        const response = await axios.put(
          "http://localhost:8000/settings/upload",
          { base64Image }, // Send the base64-encoded image as an object
          {
            headers: {
              "Content-Type": "application/json", // Set the Content-Type to JSON
            },
          }
        );
        setLogoUrl(response.data.logoUrl);
        setSelectedLogo(null);
      } catch (error) {
        console.error("Error uploading logo:", error);
      }
    };

    reader.readAsDataURL(selectedLogo);
  };

  const handleLogoDelete = async () => {
    try {
      await axios.delete("http://localhost:8000/settings/logo");
      setLogoUrl("");
    } catch (error) {
      console.error("Error deleting logo:", error);
    }
  };

  return (
    <div className="logo-settings-container">
      <h2>Logo</h2>
      {!logoUrl ? (
        <form onSubmit={handleLogoSave} encType="multipart/form-data">
          <label htmlFor="logoInput">Select Logo:</label>
          <input
            type="file"
            id="logoInput"
            accept="image/*"
            name="logo"
            onChange={handleLogoChange}
          />
          {selectedLogo && (
            <div className="logo-preview">
              <p>Selected Logo Preview:</p>
              <img
                src={URL.createObjectURL(selectedLogo)}
                alt="Selected Logo"
              />
            </div>
          )}
          <button className="logo-button" type="submit">
            Save Logo
          </button>
        </form>
      ) : (
        <div className="logo-preview">
          <p>Uploaded Logo:</p>
          <img src={logoUrl} alt="Uploaded Logo" />
          <button
            className="logo-button delete-button"
            onClick={handleLogoDelete}
          >
            Delete Logo
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoSettings;
