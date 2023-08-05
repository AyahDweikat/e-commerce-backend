import {Router} from 'express';
import * as AuthController from './controller/Auth.controller.js';
import { asyncHandler } from '../../Services/errorHandling.js';
import validation from '../../Middleware/validation.js';
import * as validators from './Auth.validation.js';
const router =Router({caseSensitive:true});

router.post('/signup',
validation(validators.signupSchema),
asyncHandler(AuthController.signup))
router.post('/login', validation(validators.loginSchema), asyncHandler(AuthController.login))
router.get('/confirmEmail/:token', validation(validators.tokenSchema), AuthController.confirmEmail)
router.get('/newConfirmEmail/:token', validation(validators.tokenSchema), AuthController.newConfirmEmail)


router.patch('/sendCode', validation(validators.sendCodeSchema), asyncHandler(AuthController.sendCode))
router.patch('/forgetPassword', validation(validators.forgetPasswordSchema), asyncHandler(AuthController.forgetPassword))


export default router;