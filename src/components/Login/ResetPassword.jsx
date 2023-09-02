import React from "react";
import { NavLink } from "react-router-dom";

const ResetPassword = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="border-2 w-96 bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="animate-pulse rounded-full bg-green-400 p-3 mb-2">
            <img
              src="./mail.svg"
              className="w-10 h-10 text-white"
              alt="Mail Icon"
            />
          </div>
          <h2 className="text-2xl text-center font-bold font-didact-gothic">
            Email Sent Successfully
          </h2>
        </div>
        <p className="text-center mt-4 mb-6 font-didact-gothic">
          An email has been sent to your email address with instructions on how
          to reset your password.
        </p>
        <NavLink
          to="https://mail.google.com/mail/"
          className="font-didact-gothic block w-full text-center  p-3 bg-black text-white font-bold rounded hover:text-yellow-500"
        >
          Check your Email
        </NavLink>
      </div>
    </div>
  );
};

export default ResetPassword;
