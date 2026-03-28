import { OTP } from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendEmail from "../utils/mail.js";

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const otp = generateOTP();

    // Store OTP in DB
    await OTP.create({ email, otp });

    // Send email
    try {
        await sendEmail({
            email,
            subject: "Verification Code - VideoAdda",
            message: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
            html: `<h2>Your OTP is: ${otp}</h2>`
        });

        // IMPORTANT: Response return karna zaroori hai
        return res.status(200).json(
            new ApiResponse(200, {}, "OTP sent successfully")
        );

    } catch (error) {
        console.log("===== EMAIL ERROR START =====");
        console.log(error);
        console.log("===== EMAIL ERROR END =====");

        throw new ApiError(500, "Failed to send verification email");
    }
});

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const latestOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!latestOTP) {
        throw new ApiError(400, "OTP expired or not found");
    }

    if (latestOTP.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    await OTP.deleteOne({ _id: latestOTP._id });

    return res.status(200).json(
        new ApiResponse(200, { verified: true }, "Email verified successfully")
    );
});

export { sendOTP, verifyOTP };
