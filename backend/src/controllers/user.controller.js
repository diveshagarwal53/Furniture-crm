import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password })

    return res.status(201).json({ success: true, message: 'User register successfully', user })

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const userExist = await User.findOne({ email })
    if (!userExist) {
        return res.status(404).json({ success: false, message: 'User doest not exists' })
    }

    const isValid = await userExist.isPasswordCorrect(password)
    if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid password' })
    }

    const accessToken = await userExist.generateAccessToken()
    const refreshToken = await userExist.generateRefreshToken()
    userExist.refreshToken = refreshToken
    await userExist.save()

    const userObj = userExist.toObject()
    delete userObj.password

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ success: true, message: 'User logged in successfully', user: userObj })
})

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    await User.findByIdAndUpdate(userId,
        {
            $set: {
                refreshToken: null
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ success: true, message: 'User logged out successfully' })
})

const getUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    const user = await User.findById(userId)

    return res.status(200).json({ success: true, message: 'User fetched successfully', user })
})

export { registerUser, loginUser, logoutUser, getUser }