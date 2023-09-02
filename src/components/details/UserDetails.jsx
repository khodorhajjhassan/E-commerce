import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserDetails = () => {
  const [details, setDetails] = useState({
    fname: "",
    lname: "",
    email: "",
    country: "",
    street: "",
    province: "",
    mobilenumber: "",
    city: "",
    building: "",
  });
  const [formState, setFormState] = useState({
    fname: "",
    lname: "",
    email: "",
    country: "",
    street: "",
    province: "",
    mobilenumber: "",
    city: "",
    building: "",
  });
  const user = useSelector((state) => state.user.user);
  const id = user?.userDetails?.id || "";


  const [success,setSuccess]=useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    password:"",
  });

  const pass_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,24}$/;


  const validateForm = () => {
    const errors = {};
  
    if (formState.password.trim() === "") {
      errors.password = "Password cannot be empty";
    } else if (!pass_regex.test(formState.password)) {
      errors.password =
        "Password must be between 8 to 24 characters and contain at least one lowercase letter, one uppercase letter, one digit, and one special character";
    }
  
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        if (user) {
          const res = await axios.get(
            `http://localhost:8000/user/details/${id}`
          );
          setDetails(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [id, user]);

  useEffect(() => {
    if (details) {
      setFormState({
        fname: details.fname,
        lname: details.lname,
        email: details.email,
        country: details.country,
        street: details.street,
        province: details.province,
        mobilenumber: details.mobilenumber,
        city: details.city,
        building: details.building,
        password: details.password,
      });
    }
  }, [details]);


  const updateUserDetails = async (event) => {
    event.preventDefault();
    if (validateForm()){
      setIsLoading(true);

  
    try {
      const updatedFormState = { ...formState };
      await axios.put(`http://localhost:8000/user/${id}`, updatedFormState);
      setSuccess(true);
      console.log("success")
    } catch (err) {
      console.log(err);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
}

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                My account
              </h6>
              <p className="bg-rose-300 cursor-auto	 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
                Settings
              </p>
            </div>
            <p className="italic text-gray-400 md:text-base text-sm">
              Here you can change your personal information.
            </p>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form onSubmit={updateUserDetails}>
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                User Information
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      First Name
                    </label>
                    <input
                      required
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="fname"
                      defaultValue={formState.fname}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Last Name
                    </label>
                    <input
                      required
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="lname"
                      defaultValue={formState.lname}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="password"
                      placeholder="*******"
                      onChange={handleInputChange}
                    />
                    <span className="text-red-500 text-sm">{error.password}</span>
                  </div>
                </div>
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Contact Information
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-12/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Address
                    </label>
                    <input
                      required
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="province"
                      defaultValue={formState.province}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      City
                    </label>
                    <input
                      required
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="city"
                      defaultValue={formState.city}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Country
                    </label>
                    <input
                      required
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="country"
                      defaultValue={formState.country}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Street
                    </label>
                    <input
                      required
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="street"
                      defaultValue={formState.street}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Building
                    </label>
                    <input
                      required
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="building"
                      defaultValue={formState.building}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Phone Number
                    </label>
                    <input
                      required
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      name="mobilenumber"
                      defaultValue={formState.mobilenumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex px-4 lg:w-4/12 items-center">
                <button
                  disabled={isLoading}
                  className="bg-rose-300 mt-5 cursor-pointer	 text-white active:bg-buttonink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="submit"
                >
                  {isLoading ? "Updating..." : "Submit"}
                </button>
                <p className="text-green-500 px-4 py-2 mt-5 font-bold">{success ? "Updating Successfuly !" : null}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
