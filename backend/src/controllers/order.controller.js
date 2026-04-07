import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const { customerId } = req.params;
    const { productName, price, status, paymentStatus } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized request" });
    }

    const order = await Order.create({
        customer: customerId,
        productName,
        price,
        status,
        paymentStatus,
        owner: userId,
    });

    return res
        .status(201)
        .json({ success: true, message: "Order created successfully", order });
});

const getOrders = asyncHandler(async (req, res) => {
    const { customerId } = req.params;

    const userId = req.user?._id;

    if (!userId) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized request" });
    }

    let { page = 1, limit = 10, search = "" } = req.query;
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const filter = {
        customer: customerId,
        owner: userId,
    };

    if (search) {
        filter.$or = [
            { productName: { $regex: search, $options: "i" } },
            { status: { $regex: search, $options: "i" } },
            { paymentStatus: { $regex: search, $options: "i" } },
        ];
    }

    const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate("customer", "name");
    const totalOrders = await Order.countDocuments(filter);

    if (orders.length === 0) {
        return res
            .status(200)
            .json({ success: true, message: "Order not found", orders: [] });
    }

    return res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        orders,
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
    });
});

const getSingleOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { customerId, orderId } = req.params;

    if (!userId) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized request" });
    }

    const order = await Order.findOne({
        _id: orderId,
        customer: customerId,
        owner: userId,
    });
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res
        .status(200)
        .json({ success: true, message: "Order fetched successfuly", order });
});

const updateOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { customerId, orderId } = req.params;
    const { productName, price, status, paymentStatus } = req.body;

    if (!userId) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized request" });
    }

    const order = await Order.findOne({
        _id: orderId,
        customer: customerId,
        owner: userId,
    });
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (productName) order.productName = productName;
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (price) order.price = price
    await order.save();

    return res
        .status(200)
        .json({ success: true, message: "Order updated successfully", order });
});

const deleteOrder = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized request" });
    }

    const { orderId } = req.params;

    await Order.findOneAndDelete({ _id: orderId, owner: userId });

    return res
        .status(200)
        .json({ success: true, message: "Order deleted successfully" });
});

const getDashboardStats = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    if (!userId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized request",
        });
    }

    const totalCustomers = await Customer.countDocuments({ owner: userId });

    const totalOrders = await Order.countDocuments({ owner: userId });

    const pendingOrders = await Order.countDocuments({
        owner: userId,
        status: "pending",
    });

    const completeOrders = await Order.countDocuments({
        owner: userId,
        status: "completed",
    });

    const revenueData = await Order.aggregate([
        {
            $match: {
                owner: userId,
                paymentStatus: "paid",
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$price" },
            },
        },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    return res
        .status(200)
        .json({
            success: true,
            message: "Dashboard stats fetched successfully",
            data: {
                totalCustomers,
                totalOrders,
                pendingOrders,
                completeOrders,
                totalRevenue,
            },
        });
});

export { createOrder, getOrders, getSingleOrder, updateOrder, deleteOrder, getDashboardStats };
