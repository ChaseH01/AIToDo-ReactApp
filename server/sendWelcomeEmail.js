const { encodeBase64 } = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net', // use Sendgrid api
    port: 587,
    secure: false,
    auth: {
        user: 'apikey',  //apikey from .env file
        pass: process.env.API_KEY,
    },
    debug: false,
    logger: true,
});

// Create a function to send the welcome email
const sendWelcomeEmail = async (email) => {
    const mailOptions = {
        from: 'chase.h@wustl.edu', //use my email
        to: email,                    // receiver address (user's email)
        subject: 'Welcome to Our ToDo App 🤗🚀🦾!', 
        text: `Hello,\n\nThank you for signing up! We are excited to have you onboard.\n\nBest regards,\n The 330 ToDo App Team`, // Plain text body
    };

    //send the email
    try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
        } catch (error) {
            console.error('Error sending email:', error);
        }
};

module.exports = sendWelcomeEmail;
