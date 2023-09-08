import { roles } from "../../Middleware/auth.middleware.js";

export const endPoint = {
    create:[roles.User],
    update:[roles.User],
    delete:[roles.Admin],
    get:[roles.Admin, roles.User],
}