import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SocialMediaLinks.scss";

const SocialMediaLinksSetting = () => {
  const initialSocialMediaLinks = JSON.parse(
    localStorage.getItem("socialMediaLinks")
  ) || {
    facebookLink: "",
    twitterLink: "",
    instagramLink: "",
  };

  const initialEditMode = JSON.parse(localStorage.getItem("editMode")) || {
    facebookLink: false,
    twitterLink: false,
    instagramLink: false,
  };

  const [socialMediaLinks, setSocialMediaLinks] = useState(
    initialSocialMediaLinks
  );
  const [editMode, setEditMode] = useState(initialEditMode);

  useEffect(() => {
    fetchSocialMediaLinks();
  }, []);

  useEffect(() => {
    localStorage.setItem("socialMediaLinks", JSON.stringify(socialMediaLinks));
  }, [socialMediaLinks]);

  useEffect(() => {
    localStorage.setItem("editMode", JSON.stringify(editMode));
  }, [editMode]);

  const fetchSocialMediaLinks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/settings/socialMediaLinks"
      );
      setSocialMediaLinks(response.data[0]);
    } catch (error) {
      console.error("Error fetching social media links:", error);
    }
  };

  const handleEditClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  const handleSaveClick = async (field) => {
    setEditMode({ ...editMode, [field]: false });
    try {
      const fieldsToUpdate = {
        [field]: socialMediaLinks[field],
        _id: socialMediaLinks._id,
      };

      await axios.put(
        `http://localhost:8000/settings/socialMediaLinks`,
        fieldsToUpdate
      );

      console.log("Social media links updated successfully!");
    } catch (error) {
      console.error("Error updating social media links:", error);
    }
  };

  const handleAddClick = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  return (
    <div className="Box BoxS1">
      <div className="social-media-links-container">
        <h2>Social Media Links</h2>
        <form>
          <div className="form-group">
            <label htmlFor="facebookInput">Facebook:</label>
            {editMode.facebookLink ? (
              <div className="edit-save-buttons">
                <input
                  type="text"
                  id="facebookInput"
                  value={socialMediaLinks.facebookLink}
                  onChange={(e) =>
                    setSocialMediaLinks({
                      ...socialMediaLinks,
                      facebookLink: e.target.value,
                    })
                  }
                  required
                />
                <span
                  className="icon save-button border-2 rounded bg-red-500 mx-2-500 cursor-pointer"
                  onClick={() => handleSaveClick("facebookLink")}
                >
                  Save
                </span>
              </div>
            ) : socialMediaLinks.facebookLink ? (
              <div className="edit-save-buttons">
                <span>{socialMediaLinks.facebookLink}</span>
                <span
                  className="icon edit-button border-2 rounded bg-green-500 mx-2 cursor-pointer"
                  onClick={() => handleEditClick("facebookLink")}
                >
                  Edit
                </span>
              </div>
            ) : (
              <span
                className="icon add-button border-2 rounded bg-blue-500 mx-2 cursor-pointer"
                onClick={() => handleAddClick("facebookLink")}
              >
                Add
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="twitterInput">Twitter:</label>
            {editMode.twitterLink ? (
              <div className="edit-save-buttons">
                <input
                  type="text"
                  id="twitterInput"
                  value={socialMediaLinks.twitterLink}
                  onChange={(e) =>
                    setSocialMediaLinks({
                      ...socialMediaLinks,
                      twitterLink: e.target.value,
                    })
                  }
                  required
                />
                <span
                  className="icon save-button border-2 rounded bg-red-500 cursor-pointer"
                  onClick={() => handleSaveClick("twitterLink")}
                >
                  Save
                </span>
              </div>
            ) : socialMediaLinks.twitterLink ? (
              <div className="edit-save-buttons">
                <span>{socialMediaLinks.twitterLink}</span>
                <span
                  className="icon edit-button border-2 rounded bg-green-500 cursor-pointer mx-2"
                  onClick={() => handleEditClick("twitterLink")}
                >
                  Edit
                </span>
              </div>
            ) : (
              <span
                className="icon add-button border-2 rounded bg-blue-500 cursor-pointer mx-2"
                onClick={() => handleAddClick("twitterLink")}
              >
                Add
              </span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="instagramInput">Instagram:</label>
            {editMode.instagramLink ? (
              <div className="edit-save-buttons">
                <input
                  type="text"
                  id="instagramInput"
                  value={socialMediaLinks.instagramLink}
                  onChange={(e) =>
                    setSocialMediaLinks({
                      ...socialMediaLinks,
                      instagramLink: e.target.value,
                    })
                  }
                  required
                />
                <span
                  className="icon save-button border-2 rounded bg-red-500 cursor-pointer"
                  onClick={() => handleSaveClick("instagramLink")}
                >
                  Save
                </span>
              </div>
            ) : socialMediaLinks.instagramLink ? (
              <div className="edit-save-buttons">
                <span>{socialMediaLinks.instagramLink}</span>
                <span
                  className="icon edit-button border-2 rounded mx-2 bg-green-500 cursor-pointer"
                  onClick={() => handleEditClick("instagramLink")}
                >
                  Edit
                </span>
              </div>
            ) : (
              <span
                className="icon add-button"
                onClick={() => handleAddClick("instagramLink")}
              >
                Add
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialMediaLinksSetting;
