import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(
      await createError(401, "You are not authenticated!", req, null)
    );
  }

  jwt.verify(token, process.env.JWT, async (err, user) => {
    if (err)
      return next(await createError(403, "Token is not Valid!", req, null));

    req.user = user;
    next();
  });
};

export const verifyUser = async (req, res, next) => {
  try {
    await verifyToken(req, res, next, async () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        return next(
          await createError(403, "You are not authorized!", req, null)
        );
      } else {
        next();
      }
    });
  } catch (error) {
    return next(await createError(403, "You are not authorized!", req, null));
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    verifyToken(req, res, next, async () => {
      if (!req.user || !req.user.isAdmin) {
        return next(
          await createError(403, "You are not authorized!", req, null)
        );
      } else {
        next();
      }
    });
  } catch (error) {
    return next(await createError(403, "You are not authorized!", req, null));
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.json({ message: "Logged out successfully!" });
};
