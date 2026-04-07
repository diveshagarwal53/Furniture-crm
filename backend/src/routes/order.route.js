import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import {
    createOrder,
    deleteOrder,
    getSingleOrder,
    updateOrder,
    getOrders,
    getDashboardStats
} from "../controllers/order.controller.js";

const router = Router();


router.route('/dashboard').get(verifyJwt, getDashboardStats)

router.route("/:customerId").post(verifyJwt, createOrder).get(verifyJwt, getOrders);
router
    .route("/:customerId/:orderId")
    .get(verifyJwt, getSingleOrder)
    .put(verifyJwt, updateOrder)
    .delete(verifyJwt, deleteOrder);

export default router;
