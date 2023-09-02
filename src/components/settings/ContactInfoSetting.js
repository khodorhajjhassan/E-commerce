import React, { useState, useEffect } from "react";
import "./Contact.scss";
import axios from "axios";

const ContactInfoSetting = () => {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
    address: "",
    _id: "",
  });

  const [editMode, setEditMode] = useState({
    email: false,
    phone: false,
    address: false,
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/settings/socialMediaLinks"
      );
      const { email, phone, address, _id } = response.data[0];

      setContactInfo({
        email: email || "",
        phone: phone || "",
        address: address || "",
        _id: _id || "",
      });
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleSaveClick = async (field) => {
    setEditMode({ ...editMode, [field]: false });
    try {
      await axios.put(
        "http://localhost:8000/settings/socialMediaLinks",
        contactInfo
      );
    } catch (error) {
      console.error("Error updating contact information:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <div className="contact-settings-container">
      <h2>Change Contact Information</h2>
      <form>
        {/* Email input */}
        <div className="form-group">
          <label htmlFor="emailInput">Email:</label>
          {editMode.email ? (
            <div className="edit-save-buttons">
              <input
                type="email"
                id="emailInput"
                name="email"
                value={contactInfo.email}
                onChange={handleInputChange}
                required
              />
              <span
                className="icon save-button border-2 rounded bg-red-500 cursor-pointer"
                onClick={() => handleSaveClick("email")}
              >
                Save
              </span>
            </div>
          ) : contactInfo.email ? (
            <div className="edit-save-buttons ">
              <span>{contactInfo.email}</span>
              <span
                className="icon edit-button mx-2 border-2 rounded bg-green-500 cursor-pointer"
                onClick={() => handleEditClick("email")}
              >
                Edit
              </span>
            </div>
          ) : (
            <span
              className="icon add-button border-2 rounded bg-red-500 cursor-pointer"
              onClick={() => handleEditClick("email")}
            >
              Add
            </span>
          )}
        </div>

        {/* Phone input */}
        <div className="form-group">
          <label htmlFor="phoneInput">Phone:</label>
          {editMode.phone ? (
            <div className="edit-save-buttons">
              <input
                type="tel"
                id="phoneInput"
                name="phone"
                value={contactInfo.phone}
                onChange={handleInputChange}
                required
              />
              <span
                className="icon save-button ml-5  border-2 rounded bg-red-500 cursor-pointer"
                onClick={() => handleSaveClick("phone")}
              >
                Save
              </span>
            </div>
          ) : contactInfo.phone ? (
            <div className="edit-save-buttons ">
              <span>{contactInfo.phone}</span>
              <span
                className="icon edit-button ml-5  border-2 rounded bg-green-500 cursor-pointer"
                onClick={() => handleEditClick("phone")}
              >
                Edit
              </span>
            </div>
          ) : (
            <span
              className="icon add-button"
              onClick={() => handleEditClick("phone")}
            >
              Add
            </span>
          )}
        </div>

        {/* Address input */}
        <div className="form-group">
          <label htmlFor="addressInput">Address:</label>
          {editMode.address ? (
            <div className="edit-save-buttons ">
              <input
                type="text"
                id="addressInput"
                name="address"
                value={contactInfo.address}
                onChange={handleInputChange}
                required
              />
              <span
                className="icon save-button my-5  m-2 border-2 rounded bg-red-500 cursor-pointer"
                onClick={() => handleSaveClick("address")}
              >
                Save
              </span>
            </div>
          ) : contactInfo.address ? (
            <div className="edit-save-buttons">
              <span>{contactInfo.address}</span>
              <span
                className="icon edit-button ml-5  border-2 rounded bg-green-500 cursor-pointer"
                onClick={() => handleEditClick("address")}
              >
                Edit
              </span>
            </div>
          ) : (
            <span
              className="icon add-button m-2 border-2 rounded bg-blue-500 cursor-pointer"
              onClick={() => handleEditClick("address")}
            >
              Add
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactInfoSetting;
