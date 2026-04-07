import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unPaid"],
        default: "unPaid"
    }


}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)
export default Order;