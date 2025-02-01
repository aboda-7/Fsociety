require("dotenv").config();
const nodemailer = require("nodemailer");
const asyncWrapper = require('../middleware/async.wrapper');
const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    secure : false,
    auth:{
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS,
    },
});

/**
 * Sends an OTP email.  // Description of the function
 * @param {string} email - The recipient's email.  // Describes the `email` parameter
 * @param {string} otp - The OTP code.  // Describes the `otp` parameter
 * @returns {Promise<boolean>} - Returns true if email sent, false if failed.  // Describes the return value
 */

const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: `"Support Team" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response); // Log success
        return true;
    } catch (error) {
        console.error("Error sending email:", error); // Log the full error
        throw new Error("Failed to send OTP email , try again"); // Throw an error to propagate it
    }
};


module.exports = sendOTP;