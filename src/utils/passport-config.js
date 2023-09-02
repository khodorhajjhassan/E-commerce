// passport-config.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
//import { useDispatch } from 'react-redux';
//import { store } from "../redux/store.js";
//import { updateuser } from '../redux/userSlice.js';

dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback", // Replace with your callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      const tokenExpiry = Date.now() + 2 * 24 * 60 * 60 * 1000;
      //const dispatch = useDispatch();
      const User = { userDetails: profile, tokenExpiry };

      // store.dispatch(updateuser(User));
      done(null, User);
    }
  )
);

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
