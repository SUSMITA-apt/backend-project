const nodemailer = require('nodemailer')

// ===============================
// Environment Variables
// ===============================

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const BACKEND_URL = process.env.BACKEND_URL

// ===============================
// Validate Environment Variables
// ===============================

if (!EMAIL_USER) {
    throw new Error('EMAIL_USER is not defined in .env')
}

if (!EMAIL_PASS) {
    throw new Error('EMAIL_PASS is not defined in .env')
}

if (!BACKEND_URL) {
    throw new Error('BACKEND_URL is not defined in .env')
}

// ===============================
// Sender
// ===============================

const SENDER = `"SUSMITA HOWLADER" <${EMAIL_USER}>`

console.log('=================================')
console.log('EMAIL_USER:', EMAIL_USER)
console.log('SENDER:', SENDER)
console.log('BACKEND_URL:', BACKEND_URL)
console.log('=================================')

// ===============================
// Create SMTP Transporter
// ===============================

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,

    auth: {
        user: 'sushmitahowlader96@gmail.com',
        pass: 'cqoh pkoe sdvi jlfz',
    },
})

// ===============================
// Verify SMTP Connection
// ===============================

transporter.verify((error) => {
    if (error) {
        console.error('SMTP connection failed:', error.message)
    } else {
        console.log('SMTP server is ready')
        console.log('SMTP account:', EMAIL_USER)
    }
})

// ===============================
// Verification Email
// ===============================

const emailSend = async (email, token) => {
    try {
        const verificationLink =
            `${BACKEND_URL}/verify-email/${token}`

        console.log('---------------------------------')
        console.log('Sending verification email')
        console.log('FROM:', SENDER)
        console.log('TO:', email)
        console.log('---------------------------------')

        const info = await transporter.sendMail({
            from: SENDER,
            to: email,
            subject: 'Verify Email for Registration',

            html: `
                <!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta charset="UTF-8">

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    >

                    <title>Verify Your Email</title>

                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f4f7fa;
                            font-family: Arial, Helvetica, sans-serif;
                        }

                        .email-container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                        }

                        .header {
                            background: linear-gradient(
                                135deg,
                                #4f46e5,
                                #7c3aed
                            );

                            color: white;
                            text-align: center;
                            padding: 40px 20px;
                        }

                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }

                        .content {
                            padding: 40px 30px;
                            color: #333;
                            text-align: center;
                        }

                        .content h2 {
                            margin-top: 0;
                            color: #111827;
                        }

                        .content p {
                            line-height: 1.7;
                            color: #6b7280;
                            margin-bottom: 25px;
                        }

                        .verify-btn {
                            display: inline-block;
                            background: #4f46e5;
                            color: white !important;
                            text-decoration: none;
                            padding: 14px 32px;
                            border-radius: 8px;
                            font-weight: 700;
                            font-size: 16px;
                        }

                        .verification-code {
                            margin: 30px 0;
                            padding: 15px;
                            background: #f3f4f6;
                            border-radius: 8px;
                            font-size: 14px;
                            word-break: break-all;
                            color: #111827;
                        }

                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 13px;
                            color: #9ca3af;
                            border-top: 1px solid #e5e7eb;
                        }
                    </style>
                </head>

                <body>

                    <div class="email-container">

                        <div class="header">
                            <h1>Your Company</h1>
                        </div>

                        <div class="content">

                            <h2>Verify Your Email Address</h2>

                            <p>
                                Thank you for signing up!
                                Please confirm your email address
                                to activate your account.
                            </p>

                            <a
                                href="${verificationLink}"
                                class="verify-btn"
                            >
                                Verify Email
                            </a>

                            <p style="margin-top:30px;">
                                Or use the verification token below:
                            </p>

                            <div class="verification-code">
                                ${token}
                            </div>

                            <p>
                                This verification link will expire in
                                <strong>1 day</strong>.
                            </p>

                            <p>
                                If you didn't create an account,
                                you can safely ignore this email.
                            </p>

                        </div>

                        <div class="footer">
                            © 2026 Your Company. All rights reserved.
                        </div>

                    </div>

                </body>
                </html>
            `,
        })

        console.log('Verification email sent successfully!')
        console.log('Message ID:', info.messageId)
        console.log('Envelope:', info.envelope)
        console.log('From:', info.from)

        return info

    } catch (error) {
        console.error(
            'Error while sending verification email:',
            error.message
        )

        throw error
    }
}

// ===============================
// Forgot Password Email
// ===============================

const forgotemail = async (email, resetToken) => {
    try {
        const resetLink =
            `${BACKEND_URL}/forgotemail/${resetToken}`

        console.log('---------------------------------')
        console.log('Sending password reset email')
        console.log('FROM:', SENDER)
        console.log('TO:', email)
        console.log('---------------------------------')

        const info = await transporter.sendMail({
            from: SENDER,
            to: email,
            subject: 'Reset Your Password',

            html: `
                <!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta charset="UTF-8">

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    >

                    <title>Reset Your Password</title>

                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f4f7fa;
                            font-family: Arial, Helvetica, sans-serif;
                        }

                        .email-container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                        }

                        .header {
                            background: linear-gradient(
                                135deg,
                                #4f46e5,
                                #7c3aed
                            );

                            color: white;
                            text-align: center;
                            padding: 40px 20px;
                        }

                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }

                        .content {
                            padding: 40px 30px;
                            color: #333;
                            text-align: center;
                        }

                        .content h2 {
                            margin-top: 0;
                            color: #111827;
                        }

                        .content p {
                            line-height: 1.7;
                            color: #6b7280;
                            margin-bottom: 25px;
                        }

                        .reset-btn {
                            display: inline-block;
                            background: #4f46e5;
                            color: white !important;
                            text-decoration: none;
                            padding: 14px 32px;
                            border-radius: 8px;
                            font-weight: 700;
                            font-size: 16px;
                        }

                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 13px;
                            color: #9ca3af;
                            border-top: 1px solid #e5e7eb;
                        }
                    </style>
                </head>

                <body>

                    <div class="email-container">

                        <div class="header">
                            <h1>Your Company</h1>
                        </div>

                        <div class="content">

                            <h2>Reset Your Password</h2>

                            <p>
                                We received a request to reset your password.
                            </p>

                            <a
                                href="${resetLink}"
                                class="reset-btn"
                            >
                                Reset Password
                            </a>

                            <p style="margin-top:30px;">
                                If you didn't request a password reset,
                                you can safely ignore this email.
                            </p>

                        </div>

                        <div class="footer">
                            © 2026 Your Company. All rights reserved.
                        </div>

                    </div>

                </body>
                </html>
            `,
        })

        console.log('Password reset email sent successfully!')
        console.log('Message ID:', info.messageId)
        console.log('Envelope:', info.envelope)
        console.log('From:', info.from)

        return info

    } catch (error) {
        console.error(
            'Error while sending reset email:',
            error.message
        )

        throw error
    }
}

// ===============================
// Export
// ===============================

module.exports = {
    emailSend,
    forgotemail,
}