const nodemailer = require('nodemailer')

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: 'shiihabhosen@gmail.com',
        pass: 'nxkvskzspswmmrjl',
    },
});


const emailSend = async (email, token) => {
    try {
        const info = await transporter.sendMail({
            from: 'shiihabhosen@gmail.com', // sender address
            to: email, // list of recipients
            subject: "Verify Email for registration", // subject line
            html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verify Your Email</title><style>body{margin:0;padding:0;background-color:#f4f7fa;font-family:Arial,Helvetica,sans-serif}.email-container{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-align:center;padding:40px 20px}.header h1{margin:0;font-size:28px}.content{padding:40px 30px;color:#333;text-align:center}.content h2{margin-top:0;color:#111827}.content p{line-height:1.7;color:#6b7280;margin-bottom:25px}.verify-btn{display:inline-block;background:#4f46e5;color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:16px}.verify-btn:hover{background:#4338ca}.verification-code{margin:30px 0;padding:15px;background:#f3f4f6;border-radius:8px;font-size:24px;font-weight:700;letter-spacing:5px;color:#111827}.footer{text-align:center;padding:20px;font-size:13px;color:#9ca3af;border-top:1px solid #e5e7eb}.footer a{color:#4f46e5;text-decoration:none}@media only screen and (max-width:600px){.content{padding:30px 20px}.header h1{font-size:24px}}</style></head><body><div class="email-container"><div class="header"><h1>Your Company</h1></div><div class="content"><h2>Verify Your Email Address</h2><p>Thank you for signing up! Please confirm your email address to activate your account and start using our services.</p><a href="http://localhost:5371/${email}" class="verify-btn">Verify Email</a><p style="margin-top:30px">Or use the verification code below:</p><div class="verification-code">${token}</div><p>This verification link and code will expire in<strong>15 minutes</strong>.</p><p>If you didn't create an account, you can safely ignore this email.</p></div><div class="footer">© 2026 Your Company. All rights reserved.<br>Need help?<a href="#">Contact Support</a></div></div></body></html>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
    
}

// forgot email
const forgotemail = async (email, resetToken) => {
    try {
        const info = await transporter.sendMail({
            from: 'shiihabhosen@gmail.com', // sender address
            to: email, // list of recipients
            subject: "Forgot Email", // subject line
            html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Password Reset</title><style>body{margin:0;padding:0;background:#f4f7fa;font-family:Arial,Helvetica,sans-serif}.container{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,.08)}.header{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;text-align:center;padding:40px 20px}.header h1{margin:0;font-size:28px}.content{padding:40px 30px;text-align:center}.content h2{color:#111827;margin-top:0}.content p{color:#6b7280;line-height:1.7;margin-bottom:24px}.reset-btn{display:inline-block;background:#ef4444;color:#fff!important;text-decoration:none;padding:14px 30px;border-radius:8px;font-weight:700;font-size:16px}.reset-btn:hover{background:#dc2626}.footer{padding:20px;text-align:center;font-size:13px;color:#9ca3af;border-top:1px solid #e5e7eb}@media (max-width:600px){.content{padding:30px 20px}}</style></head><body><div class="container"><div class="header"><h1>Your Company</h1></div><div class="content"><h2>Reset Your Password</h2><p>We received a request to reset the password for your account. Click the button below to create a new password.</p><a href="http://localhost:5371/forgotemail/${email}" class="reset-btn">Reset Password</a><p style="margin-top:30px">${resetToken}</p><p>If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p></div><div class="footer">© 2026 Your Company. All rights reserved.</div></div></body></html>`, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview URL is only available when using an Ethereal test account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
    
}


module.exports = { emailSend,forgotemail }