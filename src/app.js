import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sendEmail from "./utils/mail.js";   // SMTP test ke liye

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://backend-type-of-youtube-clone-with-imbb.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.send("API is running successfully");
});

// 🔥 SMTP TEST ROUTE
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      email: "singh26102003@gmail.com",
      subject: "Test Email from VideoAdda",
      message: "SMTP is working",
      html: "<h1>SMTP Working ✅</h1>"
    });

    res.send("Email sent successfully");
  } catch (error) {
    console.log("SMTP TEST ERROR:", error);
    res.status(500).send(error.message);
  }
});

//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import otpRouter from "./routes/otp.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import notificationRouter from "./routes/notification.routes.js"

import { ApiError } from "./utils/ApiError.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/otp", otpRouter)
app.use("/api/v1/notifications", notificationRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// error handler
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            data: err.data
        })
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Something went wrong",
        errors: []
    })
})

export { app }
