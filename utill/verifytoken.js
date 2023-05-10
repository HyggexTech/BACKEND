import jwt from "jsonwebtoken";
import createError from "./error.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Token is not valid!"));
    }
    req.user = user;
    next();
  });
};

export const verifyTeacher = (req, res, next) => {
    verifyToken(req, res, () => {
      const user = req.user;
      if (user&& user.usertype === "TEACHER") {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  };

  export const verifyStudent= (req, res, next) => {
    verifyToken(req, res, () => {
      const user = req.user;
      if (user&& user.usertype === "STUDENT") {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  }; 