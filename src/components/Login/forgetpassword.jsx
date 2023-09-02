import axios from "axios";
import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    if (validateEmail(email)) {
      setLoading(true);
      try {
        await axios.post("http://localhost:8000/auth/forgotpassword", {
          email,
        });
        navigate("/resetpassword");
        setError("");
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Email Not registered.");
        } else {
          console.error(error);
          setError("Failed to reset password. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Invalid email");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="border-2 w-96 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl text-center font-bold mb-6 font-didact-gothic">
          Forget Password
        </h2>
        <p className="text-sm mb-4 font-didact-gothic">
          Please enter the registered email address to receive the link to{" "}
          <span className="text-red-600 font-bold text-md">reset</span> your
          password.
        </p>
        <form onSubmit={handleForgotPassword}>
          <div className="flex flex-col mb-4">
            <input
              type="email"
              placeholder="Your Email Address"
              className="border border-gray-300 rounded px-3 py-2 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {loading ? (
              <div className="flex justify-center mt-4">
                <TailSpin color="#000" className="w-32" />
              </div>
            ) : (
              <button className="mt-5 font-bold py-3 bg-black font-didact-gothic text-white rounded py-2 w-full hover:text-yellow-500">
                Reset Password
              </button>
            )}
            {error && (
              <span className="text-red-500 text-center font-bold mt-4">
                {error}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
