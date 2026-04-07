import { Router } from "express";
import verifyJwt from '../middlewares/auth.middleware.js'
import {
    createCustomer,
    deleteCustomer,
    getCustomers,
    getSingleCustomer,
    updateCustomer,
} from "../controllers/customer.controller.js";

const router = Router();

router.route("/").post(verifyJwt, createCustomer).get(verifyJwt, getCustomers);

router
    .route("/:customerId")
    .get(verifyJwt, getSingleCustomer)
    .put(verifyJwt, updateCustomer)
    .delete(verifyJwt, deleteCustomer);

export default router;
