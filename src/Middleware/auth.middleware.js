import userModel from "../../DB/model/User.model.js";
import { verifyToken } from "../Services/generateAndVerifyToken.js";
export const roles = {
  Admin: "Admin",
  User: "User",
};

export const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARERKEY)) {
      return next(new Error(`Bearer Token not found`, { cause: 404 }));
    }
    let token = authorization.split(process.env.BEARERKEY)[1];
    if (!token) {
      return next(new Error(`Token Data not found`, { cause: 404 }));
    }
    const decoded = verifyToken(token, process.env.LOGIN_TOKEN);
    if (!decoded) {
      return next(new Error(` Error in token decoded`, { cause: 404 }));
    }
    const user = await userModel
      .findOne({ _id: decoded.id })
      .select("userName role");
    if (!user) return next(new Error(`Not Registered User`, { cause: 401 }));
    if (!accessRoles.includes(user.role)) {
      return next(new Error(`Not Authorized User`, { cause: 403 }));
    }
    req.user = user;
    return next();
  };
};
