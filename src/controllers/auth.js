import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import resetPasswordEmail from "../StructureMail/resetPasswordEmail.js";
import verifyEmail from "../StructureMail/verifyEmail.js";
import Logs from "../modules/Logs.js";
import User from "../modules/User.js";
import { encrypt } from "../utils/encryptdecrypt/encryptData.js";
import { createError } from "../utils/error.js";
export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const email = req.body.email;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Call createError function to log the error and store in the database
      const err = await createError(409, "Email already exists", req, null);
      return next(err); // Pass the created error to the next middleware
    }
    const t = Array.from(
      { length: 50 },
      () =>
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[
          Math.floor(Math.random() * 62)
        ]
    ).join("");
    // If the email does not exist, proceed with registration
    const newUser = new User({
      ...req.body,
      password: hash,
      emailToken: t,
    });

    const resetLink = `http://localhost:8000/auth/resetPassword/${t}`;
    await newUser.save();
    verifyEmail(email, resetLink);
    //const resetLink = `http://localhost:8000/auth/resetPassword/${t}`
    res.status(200).json({ success: true, message: "User added successfully" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email } = req.body;

    //await sendEmail('razanbittar57@gmail.com', 'dsdsds', 'sddsdsds');
    const user = await User.findOne({ email: email });
    if (!email)
      return next(
        await createError(400, "All fields are required!", req, null)
      );

    if (!user)
      return next(await createError(404, "User not found!", req, null));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!user.isVerified)
      return next(await createError(401, "User Not Verified", req, user));

    if (!isPasswordCorrect)
      return next(await createError(400, "Wrong email or password", req, user));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT,
      { expiresIn: "2d" }
    );

    const {
      __v,
      _id,
      isVerified,
      createdAt,
      fname,
      lname,
      password,
      isAdmin,
      isDelivery,
      ...userDetails
    } = user._doc;

    const name = `${fname} ${lname}`;
    userDetails.name = name;
    userDetails.id = _id;
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      samesite: "None",
      maxAge: 900000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 7 days
    });
    //console.log("admin",isAdmin)
    // console.log("d",isDelivery)
    const data = {
      userDetails,
      token,
      refreshToken,
      nat: isAdmin,
      d: isDelivery,
    };
    res.json({ data });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const GoogleLogin = async (req, res, next) => {
  try {
    const { id, emails, displayName, ...userDetail } = req.user.userDetails;
    const { tokenExpiry } = req.user;
    userDetail.name = displayName;
    userDetail.id = id;
    userDetail.email = req.user.userDetails.emails[0].value;

    // Check if the user already exists in the database
    let user = await User.findOne({
      email: req.user.userDetails.emails[0].value,
    });
    //console.log("found=>",userDetails._json);
    if (!user) {
      // If the user does not exist, create a new user in the database
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(
        String(Math.floor(Math.random() * 10000000000)).padStart(10, "0"),
        salt
      );

      user = new User({
        fname: userDetail._json.given_name,
        lname: userDetail._json.family_name,
        email: userDetail.email,
        password: hash,
        isVerified: true, // Set isVerified to true since Google users are considered verified by default
      });

      await user.save();

      const {
        __v,
        _id,
        isVerified,
        createdAt,
        fname,
        lname,
        password,
        isAdmin,
        ...userDetails
      } = user._doc;

      const name = `${fname} ${lname}`;
      userDetails.name = name;
      userDetails.id = _id;

      const token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT, {
        expiresIn: "15m",
      });

      const refreshToken = jwt.sign(
        { id: user._id, isAdmin: true },
        process.env.JWT,
        { expiresIn: "2d" }
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 900000,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 2 * 24 * 60 * 60 * 1000, // 7 days
      });

      const data = {
        userDetails,
        tokenExpiry,
      };
      const encryptData = encrypt(data);
      res.redirect(
        `http://localhost:3000/?profile=${encodeURIComponent(encryptData)}`
      );
    } else {
      const {
        __v,
        _id,
        isVerified,
        createdAt,
        fname,
        lname,
        password,
        isAdmin,
        ...userDetails
      } = user._doc;

      const name = `${fname} ${lname}`;
      userDetails.name = name;
      userDetails.id = _id;

      const token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT, {
        expiresIn: "15m",
      });

      const refreshToken = jwt.sign(
        { id: user._id, isAdmin: true },
        process.env.JWT,
        { expiresIn: "2d" }
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 900000,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 2 * 24 * 60 * 60 * 1000, // 7 days
      });

      const data = {
        userDetails,
        tokenExpiry,
      };

      const encryptData = encrypt(data);
      res.redirect(
        `http://localhost:3000/?profile=${encodeURIComponent(encryptData)}`
      );
    }
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    // console.log("lol=>",refreshToken);
    if (!refreshToken) {
      return next(createError(401, "Refresh token not found!", req, null));
    }

    jwt.verify(refreshToken, process.env.JWT, async (err, user) => {
      if (err)
        return next(
          await createError(403, "Refresh token is not valid!", req, null)
        );

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT,
        { expiresIn: "15m" }
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 900000, // 15 minutes
      });

      res.status(200).json({ token });
    });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return next(await createError(404, "Email not found", req, null));

    const salt = bcrypt.genSaltSync(10);
    const randomTenDigitNumber = String(
      Math.floor(Math.random() * 10000000000)
    ).padStart(10, "0");
    const hash = bcrypt.hashSync(randomTenDigitNumber, salt);
    existingUser.password = hash;
    existingUser.save();
    //const resetLink = `http://localhost:8000/auth/resetPassword/${t}`
    await resetPasswordEmail(existingUser.email, randomTenDigitNumber);

    res.status(200).json(`Password Reset Link Success`);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const confirmVerify = async (req, res, next) => {
  try {
    const emailToken = req.params.t;

    const user = await User.findOne({ emailToken });

    if (!user)
      return next(await createError(404, "Link is Unavailable", req, null));

    user.isVerified = true;
    await user.save();

    // Redirect the user to another page on the client-side
    // Or send a redirect URL back to the client and handle the redirection there

    return res.redirect("http://localhost:3000/login");
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

/*export const forgetConfirm = async(req,res,next)=>{

  try{
    const emailToken = req.params.t
    console.log(emailToken)
   const user = await User.find({emailToken});
console.log(user)
   if(!user) return res.status(404).json("Link is Unavailable");

   const salt = bcrypt.genSaltSync(10);
    const randomTenDigitNumber = String(Math.floor(Math.random() * 10000000000)).padStart(10, '0');
    const hash = bcrypt.hashSync(randomTenDigitNumber, salt);

   user.password = hash;
   res.status(200).json("Password Reset Success,now you can logIn");
  }
catch(err)
{
  next(err);
}
}
*/
export const getLogs = async (req, res, next) => {
  try {
    const users = await Logs.find();
    res.status(200).json(users);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const deleteLogs = async (req, res, next) => {
  try {
    const deletedLogs = await Logs.findByIdAndRemove(req.params.id);

    if (!deletedLogs)
      return next(await createError(404, "Logs not found!", req, null));

    res.status(202).json({ message: "Logs deleted successfully" });
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};

export const AddUser = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const email = req.body.email;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Call createError function to log the error and store in the database
      const err = await createError(409, "Email already exists", req, null);
      return next(err); // Pass the created error to the next middleware
    }
    const t = Array.from(
      { length: 50 },
      () =>
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[
          Math.floor(Math.random() * 62)
        ]
    ).join("");
    // If the email does not exist, proceed with registration
    const newUser = new User({
      ...req.body,
      password: hash,
      emailToken: t,
    });

    const resetLink = `http://localhost:8000/auth/resetPassword/${t}`;
    await newUser.save();
    verifyEmail(email, resetLink);
    //const resetLink = `http://localhost:8000/auth/resetPassword/${t}`
    res.status(200).json(newUser);
  } catch (err) {
    next(await createError(500, err, req, null));
  }
};
