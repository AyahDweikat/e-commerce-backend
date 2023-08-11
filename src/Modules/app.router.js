import connectDB from '../../DB/connection.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import path from 'path'; 
import {fileURLToPath} from 'url';
import CategoryRouter from './Category/Category.router.js';
import brandRouter from './Brand/brand.router.js';
import subCategoryRouter from './SubCategory/SubCategory.router.js'
import couponRouter from './Coupon/coupon.router.js'
import ProductRouter from './Products/product.router.js'
import CartRouter from './Cart/Cart.router.js'

import { globalErrorHandel } from '../Services/errorHandling.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fullPath=path.join(__dirname,'../upload');
const initApp=(app,express)=>{
    connectDB();
    app.use(express.json());
    app.use('/category', CategoryRouter)
    app.use('/subCategory', subCategoryRouter)
    app.use('/coupon', couponRouter)
    app.use('/brand', brandRouter)
    app.use('/upload',express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use('/product', ProductRouter);
    app.use('/cart', CartRouter);

    app.use('/*', (req,res)=>{
        return res.json({messaga:"page not found"});
    })
    //global error handler
    app.use(globalErrorHandel)
}
export default initApp;