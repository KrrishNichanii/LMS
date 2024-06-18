import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async function (email, subject, message) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
     
    // send mail with defined transport object
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL, // sender address
      to: email, // user email
      subject: subject, // Subject line
      html: `You can reset your password by clicking here <a href=${message} target="_blank"> Reset your password </a>`, // html body
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default sendEmail;