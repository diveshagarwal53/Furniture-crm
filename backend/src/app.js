import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);


import userRouter from './routes/user.route.js'
import customerRouter from './routes/customer.route.js'
import orderRouter from './routes/order.route.js'


app.use('/api/v10/users', userRouter)
app.use('/api/v10/customers', customerRouter)
app.use('/api/v10/orders', orderRouter)



export default app;
