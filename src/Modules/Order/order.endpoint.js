import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint = {
    create:[roles.User, roles.Admin],
    cancel:[roles.User],
    changeStatus:[roles.Admin],
}