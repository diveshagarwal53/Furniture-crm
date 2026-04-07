import Customer from "../models/customer.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const createCustomer = asyncHandler(async (req, res) => {
    const { name, phone, address } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized request" });
    }

    console.log('API hit')

    const customer = await Customer.create({
        name,
        phone,
        address,
        owner: userId,
    });

    return res
        .status(201)
        .json({ success: true, message: "Customer added successfully", customer });
});

const getCustomers = asyncHandler(async (req, res) => {
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
        owner: userId,
    };

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
        ];
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalCustomers = await Customer.countDocuments(filter);

    if (customers.length === 0) {
        return res
            .status(200)
            .json({ success: true, message: "No customer found", customers: [] });
    }

    return res.status(200).json({
        success: true,
        message: "Customers fetched successfully",
        customers,
        totalCustomers,
    });
});

const getSingleCustomer = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized request" });
    }
    const { customerId } = req.params;

    const customer = await Customer.findOne({ _id: customerId, owner: userId });

    return res.status(200).json({
        success: true,
        message: "Customer fetched successfully",
        customer,
    });
});

const updateCustomer = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized request" });
    }
    const { name, phone, address } = req.body;
    const { customerId } = req.params;

    const customer = await Customer.findOne({ _id: customerId, owner: userId });
    if (!customer) {
        return res
            .status(404)
            .json({ success: false, message: "Customer does not exists" });
    }

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;
    await customer.save();

    return res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        customer,
    });
});

const deleteCustomer = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        return res
            .status(403)
            .json({ success: false, message: "Unauthorized request" });
    }
    const { customerId } = req.params;

    await Customer.findOneAndDelete({ _id: customerId, owner: userId });

    return res
        .status(200)
        .json({ success: true, message: "Customer deleted successfully" });
});





export {
    createCustomer,
    getCustomers,
    getSingleCustomer,
    updateCustomer,
    deleteCustomer,
};
