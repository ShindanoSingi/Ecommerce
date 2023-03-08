const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
    // console.log(data)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "stmp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MP,
        },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
        from: '<abc@gmail.com>',
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info.html));
});


module.exports = sendEmail;