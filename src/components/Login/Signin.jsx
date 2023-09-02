import axios from "axios";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { updateuser } from "../../redux/userSlice.js";
import { clearWishlist } from "../../redux/wishlistSlice.js";

const Signin = () => {
  const name = useSelector((state) => state.user.user?.userDetails);
  const google = () => {
    window.open("http://localhost:8000/auth/google", "_self");
  };

  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signInClicked, setSignInClicked] = useState(true);
  const [joinClicked, setJoinClicked] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSignInClick = () => {
    setSignInClicked(true);
    setJoinClicked(false);
  };

  const handleJoinClick = () => {
    setSignInClicked(false);
    setJoinClicked(true);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    // Initialize error messages
    let emailError = "";
    let passwordError = "";

    // Validate email and password separately
    if (!validateEmail(email)) {
      emailError = "Invalid email format";
    }

    if (!validatePassword(password)) {
      passwordError = "Password must be at least 8 characters long";
    }

    // If there are any validation errors, update the state and return
    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 401) {
        setError("User not Verified");
        setLoading(false);
        return;
      }

      const { userDetails, refreshToken, token, nat, d } = response.data.data;
      const decodedToken = jwt_decode(refreshToken);
      const tokenExpiry = decodedToken.exp * 1000;

      userDetails.nat = nat;
      userDetails.d = d;

      dispatch(updateuser({ userDetails, tokenExpiry }));
      dispatch(clearWishlist());

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (nat) {
        navigate("/admin");
      } else if (d) {
        navigate("/delivery");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("User not Verified");
      } else {
        console.error("Login error:", error);
        setError("Invalid email or password");
      }
    }

    setLoading(false);
  };

  return (
    <div className=" flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="border-2 w-96 bg-white rounded-lg shadow-lg p-8">
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
        <form onSubmit={handleSignIn}>
          <div className="flex flex-col mb-4">
            <input
              type="email"
              placeholder="Your Email Address"
              className="border border-gray-300 rounded px-3 py-2 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded px-3 py-2 mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <a
              href="/forgotpassword" // Use "href" attribute to specify the URL to navigate to
              className="font-bold font-didact-gothic text-bold text-sm text-black cursor-pointer block text-base mb-8 mt-1 text-center no-underline transition-all duration-300 hover:text-yellow-500"
            >
              Forgot password?
            </a>
            {loading ? (
              <div className="flex justify-center mt-4">
                <TailSpin color="#000" className="w-32" />
              </div>
            ) : (
              <button className="mt-5 font-bold py-3 bg-black font-didact-gothic text-white rounded py-2 hover:text-yellow-500 mb-7">
                Sigin
              </button>
            )}
            {error && (
              <span className="text-red-500 text-center font-bold">
                {error}
              </span>
            )}
          </div>
        </form>
        <p className="text-center text-blue-600/45 mb-6">
          or Sign In via <span>{name ? name.email : ""}</span>{" "}
        </p>
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

export default Signin;
