import { customAlphabet } from "nanoid";
import userModel from "../../../../DB/model/User.model.js";
import {
  generateToken,
  verifyToken,
} from "../../../Services/generateAndVerifyToken.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";
import { sendEmail } from "../../../Services/sendEmail.js";
import { loginSchema, signupSchema } from "../Auth.validation.js";
import { emailTemplate } from "./emailHTML.js";

export const signup = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new Error("email already exists", { cause: 409 }));
  }
  const hashPassword = hash(password);
  const token = generateToken({ email }, process.env.SIGNUP_TOKEN, 60 * 5); // 5 minutes
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const rLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`;

  const html = emailTemplate(link, rLink);
  await sendEmail(email, "confirm email", html);
  const createUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
  });
  return res
    .status(201)
    .json({ message: "Done Registeration", user: createUser._id });
};
export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  const { email } = verifyToken(token, process.env.SIGNUP_TOKEN);
  if (!email) {
    return next(new Error("Invalid Token Payload", { cause: 400 }));
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("Not Registered account", { cause: 404 }));
  }
  if (user.confirmEmail) {
    return res.status(200).redirect(`${process.env.FE_URL}`);
  }
  const updatedUser = await userModel.updateOne(
    { email: email },
    { confirmEmail: true }
  );
  return res.status(200).redirect(`${process.env.FE_URL}`);
};
export const newConfirmEmail = async (req, res) => {
  let { token } = req.params;
  const { email } = verifyToken(token, process.env.SIGNUP_TOKEN);
  if (!email) {
    return next(new Error("Invalid Token Payload", { cause: 400 }));
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("Not Registered account", { cause: 404 }));
  }
  if (user.confirmEmail) {
    return res.status(200).redirect(`${process.env.FE_URL}`);
  }
  token = generateToken({ email }, process.env.SIGNUP_TOKEN, 60 * 60 * 12); // 5 minutes
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const html = emailTemplate(link, "");
  await sendEmail(email, "confirm email", html);
  return res.status(200).send(`<p>new confirm email is sent to your email</p>`);
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("Invalid login data", {cause:404}));
  if (!user.confirmEmail) {
    return next(new Error("plz verify your email", {cause:400}));
  }
  const match = compare(password, user.password);
  if (!match) return next(new Error("Invalid login data", {cause:400}));
  const token = generateToken({ id: user._id, role:user.role }, process.env.LOGIN_TOKEN, '1hr');
  const refreshToken = generateToken({ id: user._id, role:user.role }, process.env.LOGIN_TOKEN, 60*60*24*365 );
  return res.status(200).json({ message: "Done", token, refreshToken });
};



export const sendCode = async (req, res, next) => {
  const { email } = req.body;
  const code = customAlphabet('123456789abcdefghijklmnopqrstuvwxyz',4)
  const user = await userModel.findOneAndUpdate({email},{forgetCode:code()}, {new:true});
  const html = `<p>code for forgetting password is <b> ${user.forgetCode}</b></p>`
  await sendEmail(email, "Forget Password Email", html);
  return res.status(200).json({ message: "Code is sent to your email"});
};
export const forgetPassword = async(req, res, next)=>{
  const {code, email, password} = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new Error("Not Registered Account", {cause:404}));
  if(user.forgetCode !== code) return next(new Error("Invalid Code", {cause:404}));
  
  const hashPassword = hash(password);
  user.password = hashPassword;
  user.forgetCode = null;
  await user.save()
  
  return res.status(200).json({ message: "Password is updated", user});

}

