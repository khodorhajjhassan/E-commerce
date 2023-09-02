import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import apiToken from "../../redux/apiToken";
import { refreshAccessToken } from "../../utils/refreshAccessToken";
import "./add.scss";

const mainColors = [
  "Red",
  "Green",
  "Blue",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Brown",
  "Black",
  "White",
];

const AddedColors = ({ colorNames }) => {
  return (
    <div>
      {colorNames.map((colorObj, index) => (
        <div key={index}>
          <div>{colorObj.colorName}</div>
          {colorObj.sizes.map((sizeObj, sizeIndex) => (
            <div key={sizeIndex}>
              Size: {sizeObj.size}, Quantity: {sizeObj.quantity}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Add = (props) => {
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const [colorNames, setColorNames] = useState([]);
  //const [sizes, setSizes] = useState([]);
  //const [colorNameInput, setColorNameInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [subsubcategoryInputs, setSubsubcategoryInputs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiToken.get("http://localhost:8000/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    //console.log("productsprops",props.slug);
    fetchCategories();
  }, [props.slug === "product"]);

  const handleAddColor = () => {
    if (
      selectedColor.trim() === "" ||
      sizeInput.trim() === "" ||
      quantityInput.trim() === ""
    ) {
      return;
    }

    const existingColor = colorNames.find(
      (color) => color.colorName === selectedColor
    );

    if (existingColor) {
      // Color already exists, update sizes and quantities
      const updatedColors = colorNames.map((color) =>
        color.colorName === selectedColor
          ? {
              ...color,
              sizes: [
                ...color.sizes,
                { size: sizeInput, quantity: parseInt(quantityInput) },
              ],
            }
          : color
      );
      setColorNames(updatedColors);
    } else {
      // Color does not exist, add a new entry
      setColorNames([
        ...colorNames,
        {
          colorName: selectedColor,
          sizes: [{ size: sizeInput, quantity: parseInt(quantityInput) }],
        },
      ]);
    }
    /*
    setSelectedColor(""); // Clear the selected color after adding
    setSizeInput("");
    setQuantityInput("");
    */
  };

  const handleCategoryChange = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryChange = (subcategoryName) => {
    const subcategory = selectedCategory.subcategories.find(
      (subcat) => subcat.name === subcategoryName
    );
    setSelectedSubcategory(subcategory);
  };

  const handleAddSubsubcategoryInput = () => {
    setSubsubcategoryInputs([...subsubcategoryInputs, ""]);
  };

  const handleSubsubcategoryInputChange = (index, value) => {
    const updatedInputs = [...subsubcategoryInputs];
    updatedInputs[index] = value;
    setSubsubcategoryInputs(updatedInputs);
  };
  const handleRemoveSubsubcategoryInput = (index) => {
    const updatedInputs = [...subsubcategoryInputs];
    updatedInputs.splice(index, 1);
    setSubsubcategoryInputs(updatedInputs);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("the page I am in now", props.slug);

    if (props.slug === "product") {
      const formElements = e.target.elements;
      const formValues = {
        productimg: [],
      };
      const formValues2 = {
        productimg: [],
      };

      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (element.name) {
          if (element.type === "file" && element.name === "productimg") {
            if (element.files.length > 0) {
              for (let j = 0; j < element.files.length; j++) {
                formValues.productimg.push(element.files[j]);
              }
            }
          } else {
            formValues[element.name] = element.value;
          }
        }
      }

      formValues.color = colorNames.map((color) => ({
        colorName: color.colorName,
        sizes: color.sizes,
      }));

      const base64Images = await Promise.all(
        formValues.productimg.map(async (file) => {
          const base64String = await getBase64(file);
          return base64String;
        })
      );

      formValues.category = selectedCategory ? selectedCategory.name : "";
      formValues.subcategory = selectedSubcategory
        ? selectedSubcategory.name
        : "";
      formValues2.productimg = base64Images;
      //console.log(formValues2);

      //props.setOpen(false);

      try {
        setLoading(true);

        // Step 1: Upload the shoe image to the server
        const response2 = await apiToken.post(`/shoe/upload`, formValues2, {
          withCredentials: true,
        });
        // console.log(response2.data);
        formValues.productimg = response2.data;

        // Step 2: Add the product to the server
        await apiToken.post(`/shoe`, formValues, { withCredentials: true });
        //console.log("Response from server:", response.data);

        setLoading(false); // Stop the loading state
        props.setOpen(false);
        setSuccessMessage("Product added successfully!");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Access token expired, try to refresh the token

          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Retry the API request with the new access token
            try {
              setLoading(true);

              // Step 1: Upload the shoe image to the server
              const response2 = await apiToken.post(
                `/shoe/upload`,
                formValues2,
                { withCredentials: true }
              );
              // console.log(response2.data);
              formValues.productimg = response2.data;

              // Step 2: Add the product to the server with the new access token
              await apiToken.post(`/shoe`, formValues, {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              });
              //console.log("Response from server:", response.data);

              setLoading(false); // Stop the loading state
              props.setOpen(false);
              setSuccessMessage("Product added successfully!");
            } catch (error) {
              //console.error("Error making the request:", error);
              setLoading(false); // Stop the loading state
              setSuccessMessage("Product did Not been Added!");
            }
          } else {
            console.error("Failed to refresh access token.");
            // Handle the scenario when the refresh token is also expired, e.g., redirect to the login page.
          }
        } else {
          console.error("Error making the request:", error);
          setLoading(false); // Stop the loading state
          setSuccessMessage("Product did Not been Added!");
        }
      }
    } else if (props.slug === "category") {
      const formElements = e.target.elements;
      const formValues = {};
      let formValuefinal = {};

      try {
        for (let i = 0; i < formElements.length; i++) {
          const element = formElements[i];
          if (element.name) {
            formValues[element.name] = element.value;
          }
        }

        const newSubsubcategories = subsubcategoryInputs.filter(
          (input) => input.trim() !== ""
        );
        formValues.subcategories = {
          name: formValues.subcategories,
          subsubcategories: [
            formValues.subsubcategories,
            ...newSubsubcategories,
          ],
        };
        delete formValues.subsubcategories;

        //console.log("name", formValues.name);

        const catgegoryName = await apiToken.get(
          `/category/name/${formValues.name}`,
          { withCredentials: true }
        );

        if (catgegoryName.data[0]) {
          const isNameMatching = catgegoryName.data[0].subcategories.some(
            (subcategory) => subcategory.name === formValues.subcategories.name
          );

          if (catgegoryName.data[0].name === formValues.name) {
            if (!isNameMatching) {
              formValuefinal = formValues;
              // console.log("cat", catgegoryName.data[0]._id);

              const updatedCategory = {
                ...catgegoryName.data[0],
              };

              updatedCategory.subcategories.push({
                name: formValuefinal.subcategories.name,
                subsubcategories: formValuefinal.subcategories.subsubcategories,
              });

              await apiToken.put(
                `/category/${updatedCategory["_id"]}`,
                updatedCategory,
                { withCredentials: true }
              );
            }

            if (isNameMatching) {
              formValuefinal = formValues;

              const subcategoryIndex =
                catgegoryName.data[0].subcategories.findIndex(
                  (subcategory) =>
                    subcategory.name === formValuefinal.subcategories.name
                );

              if (subcategoryIndex !== -1) {
                const updatedSubcategories = [
                  ...catgegoryName.data[0].subcategories,
                ];
                updatedSubcategories[subcategoryIndex].subsubcategories.push(
                  ...formValuefinal.subcategories.subsubcategories
                );

                const updatedCategory = {
                  ...catgegoryName.data[0],
                  subcategories: updatedSubcategories,
                };

                await apiToken.put(
                  `/category/${updatedCategory["_id"]}`,
                  updatedCategory,
                  { withCredentials: true }
                );
              }
            }
          }
        } else {
          const response = await apiToken.post(`/category`, formValues, {
            withCredentials: true,
          });
          const modifiedData = {
            ...response.data,
            id: response.data._id,
          };

          props.setCategories([...props.categories, modifiedData]);
          //console.log(response);
          props.setOpen(false);
        }
      } catch (error) {
        console.error("An error occurred:", error);

        if (error.response && error.response.status === 401) {
          // Access token expired, try to refresh the token
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              // Retry the category logic with the new access token

              for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.name) {
                  formValues[element.name] = element.value;
                }
              }

              const newSubsubcategories = subsubcategoryInputs.filter(
                (input) => input.trim() !== ""
              );
              formValues.subcategories = {
                name: formValues.subcategories,
                subsubcategories: [
                  formValues.subsubcategories,
                  ...newSubsubcategories,
                ],
              };
              delete formValues.subsubcategories;

              const catgegoryName = await apiToken.get(
                `/category/name/${formValues.name}`,
                { withCredentials: true }
              );

              if (catgegoryName.data[0]) {
                const isNameMatching = catgegoryName.data[0].subcategories.some(
                  (subcategory) =>
                    subcategory.name === formValues.subcategories.name
                );

                if (catgegoryName.data[0].name === formValues.name) {
                  if (!isNameMatching) {
                    formValuefinal = formValues;
                    //console.log("cat", catgegoryName.data[0]._id);

                    const updatedCategory = {
                      ...catgegoryName.data[0],
                    };

                    updatedCategory.subcategories.push({
                      name: formValuefinal.subcategories.name,
                      subsubcategories:
                        formValuefinal.subcategories.subsubcategories,
                    });

                    await apiToken.put(
                      `/category/${updatedCategory["_id"]}`,
                      updatedCategory,
                      { withCredentials: true }
                    );
                  }

                  if (isNameMatching) {
                    formValuefinal = formValues;

                    const subcategoryIndex =
                      catgegoryName.data[0].subcategories.findIndex(
                        (subcategory) =>
                          subcategory.name === formValuefinal.subcategories.name
                      );

                    if (subcategoryIndex !== -1) {
                      const updatedSubcategories = [
                        ...catgegoryName.data[0].subcategories,
                      ];
                      updatedSubcategories[
                        subcategoryIndex
                      ].subsubcategories.push(
                        ...formValuefinal.subcategories.subsubcategories
                      );

                      const updatedCategory = {
                        ...catgegoryName.data[0],
                        subcategories: updatedSubcategories,
                      };

                      await apiToken.put(
                        `/category/${updatedCategory["_id"]}`,
                        updatedCategory,
                        { withCredentials: true }
                      );
                      // console.log(apiUpdate);
                    }
                  }
                }
              } else {
                const response = await apiToken.post(`/category`, formValues, {
                  withCredentials: true,
                });
                const modifiedData = {
                  ...response.data,
                  id: response.data._id,
                };

                props.setCategories([...props.categories, modifiedData]);
                //console.log(response);
                props.setOpen(false);
              }
            } else {
              console.error("Failed to refresh access token.");
              // Handle the scenario when the refresh token is also expired, e.g., redirect to the login page.
            }
          } catch (error) {
            console.error("Error refreshing access token:", error);
          }
        }
      }
    } else if (props.slug === "admins") {
      try {
        const formElements = e.target.elements;
        const formValues = {};

        for (let i = 0; i < formElements.length; i++) {
          const element = formElements[i];
          if (element.name) {
            formValues[element.name] = element.value;
          }
        }

        formValues.password = "FootVibeboard619";
        formValues.isAdmin = isAdmin;
        formValues.isDelivery = isDelivery;

        const res = await apiToken.post(`/auth/add`, formValues, {
          withCredentials: true,
        });

        const modifiedData = {
          ...res.data,
          id: res.data._id,
        };
        props.setUsers([...props.users, modifiedData]);
        setLoading(false);
        setSuccessMessage("User Added!");
        props.setOpen(false);
      } catch (error) {
        console.error("An error occurred:", error);

        if (error.response && error.response.status === 401) {
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              const formElements = e.target.elements;
              const formValues = {};

              for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.name) {
                  formValues[element.name] = element.value;
                }
              }

              formValues.password = "FootVibeboard619";
              formValues.isAdmin = isAdmin;
              formValues.isDelivery = isDelivery;

              await apiToken.post(`/auth/register`, formValues, {
                withCredentials: true,
              });

              props.setUsers([...props.users, formValues]);
              setLoading(false);
              setSuccessMessage("User Added!");
              props.setOpen(false);
            } else {
              console.error("Failed to refresh access token.");
            }
          } catch (error) {
            console.error("Error refreshing access token:", error);
          }
        }
      }
    }
  };
  return (
    <div className="custom-add">
      <div className="custom-modal">
        <span className="custom-close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1 className="text-center">Add new {props.slug}</h1>
        <form
          className="addform"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {props.columns
            .filter(
              (item) =>
                item.field !== "id" &&
                item.field !== "img" &&
                item.field !== "profileimg" &&
                item.field !== "createdAt" &&
                item.field !== "isVerified" &&
                item.field !== "actions"
            )
            .map((column) => (
              <div className="custom-item" key={column.field}>
                <label className="headlabel">{column.headerName}</label>
                {column.field === "color" ? (
                  <div>
                    {/* Dropdown menu for color selection */}
                    <select
                      className="mb-2 bg-gray-200 text-gray-800 border border-gray-300 rounded-md p-2"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      required
                    >
                      <option value="">Select Color</option>
                      {mainColors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    <input
                      className="inputhead mb-1"
                      type="number"
                      placeholder="Size"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      required
                    />
                    <input
                      className="inputhead"
                      type="number"
                      placeholder="Quantity"
                      value={quantityInput}
                      onChange={(e) => setQuantityInput(e.target.value)}
                      required
                    />
                    <button
                      className="bg-green-600 border-2 rounded mt-1 p-1"
                      type="button"
                      onClick={handleAddColor}
                    >
                      Add Color
                    </button>
                  </div>
                ) : column.field === "isAdmin" ? (
                  <select
                    className="mb-2 bg-gray-200 text-gray-800 border border-gray-300 rounded-md p-2"
                    value={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.value === "true")}
                    required
                  >
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select>
                ) : column.field === "isDelivery" ? (
                  <select
                    className="mb-2 bg-gray-200 text-gray-800 border border-gray-300 rounded-md p-2"
                    value={isDelivery}
                    onChange={(e) => setIsDelivery(e.target.value === "true")}
                    required
                  >
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select>
                ) : column.field === "category" ? (
                  <select
                    className="bg-gray-200 text-gray-800 border border-gray-300 rounded-md p-2"
                    name="category"
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : column.field === "subcategory" ? (
                  <select
                    className="bg-gray-200 text-gray-800 border border-gray-300 rounded-md p-2"
                    name="subcategory"
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory &&
                      selectedCategory.subcategories.map((subcategory) => (
                        <option key={subcategory._id} value={subcategory.name}>
                          {subcategory.name}
                        </option>
                      ))}
                  </select>
                ) : column.field === "subsubcategory" ? (
                  <select
                    className="bg-gray-200 text-gray-800 border border-gray-300 rounded-md p-2"
                    name="subsubcategory"
                    required
                  >
                    <option value="">Select Subsubcategory</option>
                    {selectedSubcategory &&
                      selectedSubcategory.subsubcategories.map(
                        (subsubcategory) => (
                          <option key={subsubcategory} value={subsubcategory}>
                            {subsubcategory}
                          </option>
                        )
                      )}
                  </select>
                ) : column.type === "image" ? (
                  <input
                    type="file"
                    name="productimg"
                    placeholder={column.field}
                    accept="image/*"
                    multiple
                    required
                  />
                ) : (
                  <input
                    className="inputhead"
                    type={column.type}
                    name={column.field}
                    placeholder={column.field}
                    required
                  />
                )}
              </div>
            ))}
          {props.slug === "category" && (
            <div>
              {subsubcategoryInputs.map((input, index) => (
                <div key={index} className="subsubcategory-input">
                  <input
                    key={index}
                    type="text"
                    placeholder="Subsubcategory"
                    value={input}
                    onChange={(e) =>
                      handleSubsubcategoryInputChange(index, e.target.value)
                    }
                    className="text-black rounded flex flex-col m-2 p-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubsubcategoryInput(index)}
                  >
                    <span className="text-red-500">X</span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mb-2 border-2 rounded bg-black p-2 hover:scale-110"
                onClick={handleAddSubsubcategoryInput}
              >
                Add Subsubcategory
              </button>
            </div>
          )}

          <button
            className={`${
              loading
                ? "w-full p-2 flex justify-center items-center"
                : "w-full p-2 cursor-pointer bg-yellow-500 hover:transform hover:scale-105 font-didact-gothic"
            }`}
            disabled={loading}
          >
            {loading ? (
              <RotatingLines class color="#ffffff" size={20} />
            ) : (
              "Add"
            )}
          </button>
        </form>
      </div>
      {/* Render the added colors outside the form */}
      {props.slug === "product" ? (
        <div className="added-colors bg-slate-800 border-2 p-2">
          <h2>Added Colors</h2>
          <AddedColors colorNames={colorNames} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Add;
