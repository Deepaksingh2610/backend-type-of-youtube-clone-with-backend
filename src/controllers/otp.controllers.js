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

    // Store in DB (TTL handles cleanup)
    await OTP.create({ email, otp });

    // Send via email
    try {
        await sendEmail({
            email,
            subject: "Verification Code - VideoAdda",
            message: `Your verification code is: ${otp}. It will expire in 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #0f0f0f; color: white; padding: 40px; border-radius: 10px; text-align: center;">
                    <h1 style="color: #ae7aff;">VideoAdda</h1>
                    <p style="font-size: 18px;">Your verification code is:</p>
                    <div style="background-color: #2a2a2a; border: 2px solid #ae7aff; display: inline-block; padding: 20px 40px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ae7aff; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #888;">This code will expire in 5 minutes.</p>
                </div>
            `
        });

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "OTP sent successfully to " + email));
    } catch (error) {
        console.error("Email send error:", error);
        throw new ApiError(500, "Failed to send verification email. Please check your SMTP settings.");
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

    // OTP is valid, we can delete it now or let TTL do it
    await OTP.deleteOne({ _id: latestOTP._id });

    return res
        .status(200)
        .json(new ApiResponse(200, { verified: true }, "Email verified successfully"));
});

export { sendOTP, verifyOTP };
