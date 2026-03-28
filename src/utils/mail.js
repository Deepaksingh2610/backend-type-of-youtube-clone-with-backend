import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("EMAIL SENT SUCCESS:", info.response);
        return info;

    } catch (error) {
        console.log("EMAIL ERROR FULL:", error);
        throw error;
    }
};

export default sendEmail;


























// import nodemailer from "nodemailer";

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS,
//         },
//     });

//     const mailOptions = {
//         from: process.env.SMTP_USER,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         html: options.html,
//     };

//     await transporter.sendMail(mailOptions);
// };

// export default sendEmail;






















// import nodemailer from "nodemailer";

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         secure: false,
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS,
//         },
//     });

//     const mailOptions = {
//         from: process.env.SMTP_FROM,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         html: options.html,
//     };

//     await transporter.sendMail(mailOptions);
// };

// export default sendEmail;
