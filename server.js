import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import authRoute from "./src/routes/auth.js";
import categorieRoute from "./src/routes/categories.js";
import deliveryRoute from "./src/routes/delivery.js";
import feedbackRoute from "./src/routes/feedback.js";
import orderRoute from "./src/routes/order.js";
import paymentRoute from "./src/routes/payment.js";
import mailingRoute from "./src/routes/mailingListRoute.js";
import shoeRoute from "./src/routes/shoe.js";
import userRoute from "./src/routes/user.js";
import visiteduserRoute from "./src/routes/visiteduser.js";
import settingRoute from "./src/routes/settingRoutes.js";
import "./src/utils/passport-config.js";
const app = express();

dotenv.config();

// Server configuration
const port = process.env.PORT || 8000;

app.use(
  session({
    secret: "your-secret-key", // Replace with a secret key for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // Set to true if using HTTPS
      sameSite: "none", // Set to "none" if using cross-origin requests
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days (example: adjust the maxAge as needed)
    },
  })
);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
//Middleware
app.use(cookieParser());

app.use(express.json({ limit: "50mb" }));

// Middleware to parse incoming URL-encoded data
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/category", categorieRoute);
app.use("/delivery", deliveryRoute);
app.use("/feedback", feedbackRoute);
app.use("/order", orderRoute);
app.use("/payment", paymentRoute);
app.use("/shoe", shoeRoute);
app.use("/visteduser", visiteduserRoute);
app.use("/settings", settingRoute);
app.use("/mailing", mailingRoute);
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went Wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

mongoose
  .connect(process.env.Mongoconnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server once the database connection is established
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
