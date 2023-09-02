import axios from "axios";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TailSpin } from "react-loader-spinner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { NavLink, useNavigate } from "react-router-dom";

const email_regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const pass_regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 10);

const Register = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errfound, setErrFound] = useState(false);
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [signInClicked, setSignInClicked] = useState(false);
  const [joinClicked, setJoinClicked] = useState(true);
  const [phone, setPhone] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);

  const google = () => {
    window.open("http://localhost:8000/auth/google", "_self");
  };

  const handleSignInClick = () => {
    setSignInClicked(true);
    setJoinClicked(false);
  };

  const handleJoinClick = () => {
    setSignInClicked(false);
    setJoinClicked(true);
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleDateChange = (date) => {
    setDateOfBirth(date);
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    handleSubmit();
  };

  const validateForm = () => {
    const errors = {};

    if (!firstName) {
      errors.firstName = "First name is required";
    }

    if (!lastName) {
      errors.lastName = "Last name is required";
    }

    if (!email || !email_regex.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!password || !pass_regex.test(password)) {
      errors.password =
        "Password must be between 8 to 24 characters and contain at least one lowercase letter, one uppercase letter, one digit, and one special character";
    }

    if (!selectedValue) {
      errors.gender = "Please select a gender";
    }

    if (!phone) {
      errors.phone = "Phone number is required";
    }

    if (!dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      const userData = {
        fname: firstName,
        lname: lastName,
        email,
        password,
        mobilenumber: phone,
        gender: selectedValue,
        birthday: dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : null,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/auth/register",
          userData
        );
        if (response.status === 200) {
          navigate("/verification");
          setErrFound(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setErrFound(true);
          setError("Email Already Registered");
          setLoading(false);
          return;
        }

        setErrFound(true);
        setError("Server Down");

        //setEmailExists(true);
        // Show an error message to the user for network or server-related issues
        // Replace the following line with your preferred error-handling mechanism (e.g., displaying a toast, modal, etc.)
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 mt-3">
      <div className="border-2 w-96 bg-white rounded-lg shadow-lg p-8 m-5">
        <div className="flex justify-between mb-10">
          <div className="flex-col">
            <NavLink
              to="/login"
              className={`mx-10 font-semibold text-xl ${
                signInClicked ? "text-black" : "text-blue-600/25"
              }`}
              onClick={handleSignInClick}
            >
              <span className="text-2xl">S</span>ign In
            </NavLink>
            <div
              className={`${
                signInClicked ? "mx-9 w-23 border-2 border-yellow-500" : ""
              }`}
            ></div>
          </div>
          <div className="flex-col">
            <NavLink
              to="/join"
              className={`mx-10 font-semibold text-xl ${
                joinClicked ? "text-black" : "text-blue-600/25"
              }`}
              onClick={handleJoinClick}
            >
              <span className="text-2xl">J</span>oin
            </NavLink>
            <div
              className={`${
                joinClicked ? "mx-8 w-14 border-2 border-yellow-500" : ""
              }`}
            ></div>
          </div>
        </div>
        <form onSubmit={handleSubmitForm}>
          <div className="flex flex-col mb-4 gap-1.5">
            <input
              type="text"
              placeholder="First Name"
              className="border border-gray-300 rounded px-3 py-2 mb-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {formErrors.firstName && (
              <span className="text-red-500 font-bold">
                {formErrors.firstName}
              </span>
            )}

            <input
              type="text"
              placeholder="Last Name"
              className="border border-gray-300 rounded px-3 py-2 mb-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {formErrors.lastName && (
              <span className="text-red-500 font-bold">
                {formErrors.lastName}
              </span>
            )}

            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 rounded px-3 py-2 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formErrors.email && (
              <span className="text-red-500 font-bold">{formErrors.email}</span>
            )}

            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded px-3 py-2 mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formErrors.password && (
              <span className="text-red-500 font-bold">
                {formErrors.password}
              </span>
            )}

            <PhoneInput
              country={"lb"}
              value={phone}
              onChange={handlePhoneChange}
              inputStyle={{
                width: "100%",
              }}
            />
            {formErrors.phone && (
              <span className="text-red-500 font-bold">{formErrors.phone}</span>
            )}

            <div className="flex flex-row items-center mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Male"
                  checked={selectedValue === "Male"}
                  onChange={handleChange}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 font-didact-gothic font-bold">Male</span>
              </label>

              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  value="Female"
                  checked={selectedValue === "Female"}
                  onChange={handleChange}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2 font-didact-gothic font-bold">
                  Female
                </span>
              </label>

              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  value="Other"
                  checked={selectedValue === "Other"}
                  onChange={handleChange}
                  className="form-radio text-indigo-600 "
                />
                <span className="ml-2 font-didact-gothic font-bold">Other</span>
              </label>
            </div>

            {formErrors.gender && (
              <span className="text-red-500 font-bold">
                {formErrors.gender}
              </span>
            )}
            <div className="flex mt-4 items-center w-full gap-1">
              <label className="block mb-2 font-didact-gothic font-bold">
                Date of Birth:
              </label>
              <DatePicker
                selected={dateOfBirth}
                defaultValue={maxDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                maxDate={maxDate}
                className="w-full px-3 py-2 border rounded text-gray-700 text-sm font-semibold focus:outline-none focus:border-blue-500 bg-white shadow-md cursor-pointer"
              />
            </div>
            {formErrors.dateOfBirth && (
              <span className="text-red-500 font-bold">
                {formErrors.dateOfBirth}
              </span>
            )}
            {loading ? (
              <div className="flex justify-center mt-4">
                <TailSpin color="#000" className="w-32" />
              </div>
            ) : (
              <button className="mt-5 font-bold py-3 bg-black font-didact-gothic text-white rounded py-2 hover:text-yellow-500 mb-7">
                Join Now
              </button>
            )}
            {errfound && (
              <span className="text-red-500 text-center font-bold">
                {error}
              </span>
            )}
          </div>
        </form>
        <p className="text-center text-blue-600/45 mb-5 text-xs">
          By creating your account, you agree to our{" "}
          <span className="underline">Terms & Conditions</span> &{" "}
          <span className="underline"> Privacy Policy </span>
        </p>
        <p className="text-center text-blue-600/45 ">or Sign In via</p>
        <div className="flex flex-col items-center py-5 gap-2 text-center">
          <button
            onClick={google}
            className="bg-white-600 px-4 py-2 border flex gap-2 border-slate-600 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
          >
            <img
              className="w-6 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
            />
            <span>Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
