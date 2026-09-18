const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/userModel')
const {
    emailSend,
    forgotemail
} = require('../utils/emailSenter')

// ===============================
// Helper: Normalize Email
// ===============================

const normalizeEmail = (email) => {
    return email.trim().toLowerCase()
}

// ===============================
// Registration Controller
// ===============================

const registrationController = async (req, res) => {
    try {
        const {
            email,
            password,
            confirmPassword,
            terms
        } = req.body

        // Validate required fields
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all fields'
            })
        }

        // Validate email
        const normalizedEmail = normalizeEmail(email)

        // Validate terms
        if (!terms) {
            return res.status(400).json({
                success: false,
                message: 'Please accept the terms and conditions'
            })
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            })
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail
        })

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        )

        // Create user
        const user = new User({
            email: normalizedEmail,
            password: hashedPassword,
            terms
        })

        await user.save()

        // Create verification token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        )

        // Send verification email
        await emailSend(user.email, token)

        return res.status(201).json({
            success: true,
            message:
                'Registration successful! Please check your email for verification.'
        })

    } catch (error) {
        console.error(
            'Registration Error:',
            error
        )

        return res.status(500).json({
            success: false,
            message: 'Registration failed'
        })
    }
}

// ===============================
// Verify Email Controller
// ===============================

const verifyEmailController = async (req, res) => {
    try {
        const { token } = req.params

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            })
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        // Find user
        const user = await User.findById(
            decoded.id
        )

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Already verified
        if (user.isVerified) {
            return res.status(200).json({
                success: true,
                message: 'Email is already verified'
            })
        }

        // Verify user
        user.isVerified = true

        await user.save()

        return res.status(200).json({
            success: true,
            message:
                'Email verified successfully!'
        })

    } catch (error) {
        console.error(
            'Email Verification Error:',
            error
        )

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message:
                    'Verification token has expired'
            })
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message:
                    'Invalid verification token'
            })
        }

        return res.status(500).json({
            success: false,
            message:
                'Email verification failed'
        })
    }
}

// ===============================
// Login Controller
// ===============================

const logincontroller = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    'Please fill in all fields'
            })
        }

        const normalizedEmail =
            normalizeEmail(email)

        const existingUser =
            await User.findOne({
                email: normalizedEmail
            })

        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // Check password
        const passwordMatch =
            await bcrypt.compare(
                password,
                existingUser.password
            )

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // Access token
        const accessToken = jwt.sign(
            {
                id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role
            },
            process.env.ACCESS_SECRET,
            {
                expiresIn: '1d'
            }
        )

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token: accessToken,
            data: {
                id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role,
                isVerified:
                    existingUser.isVerified,
                status:
                    existingUser.userStatus,
                fristName:
                    existingUser.fristName,
                lastName:
                    existingUser.lastName,
                phonenumber:
                    existingUser.phonenumber,
                billingAddress:
                    existingUser.billingAddress
            }
        })

    } catch (error) {
        console.error(
            'Login Error:',
            error
        )

        return res.status(500).json({
            success: false,
            message: 'Login failed'
        })
    }
}

// ===============================
// Forgot Password Controller
// ===============================

const forgotpasswordcontroller = async (
    req,
    res
) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                success: false,
                message:
                    'Please enter your email'
            })
        }

        const normalizedEmail =
            normalizeEmail(email)

        const existingUser =
            await User.findOne({
                email: normalizedEmail
            })

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Create reset token
        const resetToken = jwt.sign(
            {
                id: existingUser._id,
                email: existingUser.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '15m'
            }
        )

        await forgotemail(
            existingUser.email,
            resetToken
        )

        return res.status(200).json({
            success: true,
            message:
                'Please check your email for the password reset link'
        })

    } catch (error) {
        console.error(
            'Forgot Password Error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Failed to send password reset email'
        })
    }
}

// ===============================
// Reset Password Controller
// ===============================

const resetpassword = async (req, res) => {
    try {
        const {
            newpassword,
            confrimnewpassword
        } = req.body

        const { token } = req.params

        if (!token) {
            return res.status(400).json({
                success: false,
                message:
                    'Reset token is required'
            })
        }

        if (
            !newpassword ||
            !confrimnewpassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Please fill in all fields'
            })
        }

        if (
            newpassword !==
            confrimnewpassword
        ) {
            return res.status(400).json({
                success: false,
                message:
                    'Passwords do not match'
            })
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        // Find user
        const existingUser =
            await User.findById(decoded.id)

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Hash new password
        const hashedPassword =
            await bcrypt.hash(
                newpassword,
                10
            )

        existingUser.password =
            hashedPassword

        await existingUser.save()

        return res.status(200).json({
            success: true,
            message:
                'Password reset successful!'
        })

    } catch (error) {
        console.error(
            'Reset Password Error:',
            error
        )

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message:
                    'Reset token has expired'
            })
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message:
                    'Invalid reset token'
            })
        }

        return res.status(500).json({
            success: false,
            message:
                'Password reset failed'
        })
    }
}

// ===============================
// Reverification Controller
// ===============================

const reverificathion = async (
    req,
    res
) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            })
        }

        const normalizedEmail =
            normalizeEmail(email)

        const existingUser =
            await User.findOne({
                email: normalizedEmail
            })

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (existingUser.isVerified) {
            return res.status(400).json({
                success: false,
                message:
                    'Email is already verified'
            })
        }

        // Create new verification token
        const token = jwt.sign(
            {
                id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        )

        // Send verification email
        await emailSend(
            existingUser.email,
            token
        )

        return res.status(200).json({
            success: true,
            message:
                'Verification email has been sent!'
        })

    } catch (error) {
        console.error(
            'Reverification Error:',
            error
        )

        return res.status(500).json({
            success: false,
            message:
                'Failed to send verification email'
        })
    }
}

// ===============================
// Export Controllers
// ===============================

module.exports = {
    registrationController,
    verifyEmailController,
    logincontroller,
    forgotpasswordcontroller,
    resetpassword,
    reverificathion
}