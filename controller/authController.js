const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const { emailSend, forgotemail } = require('../utils/emailSenter')
const bcrypt = require('bcryptjs')


// registration controller
const registrationController = async (req, res) => {
    const { email, password, confirmPassword, terms } = req.body
    if (!email || !password || !confirmPassword) {
        return res.json({
            success: false,
            message: 'please fill up the all fild'
        })
    }
    if (!terms) {
        return res.json({
            success: false,
            message: 'please fill up the terms and condition!'
        })
    }
    if (password !== confirmPassword) {
        return res.json({
            success: false,
            message: 'password dont mach'
        })
    }

    let existingall = await User.findOne({ email: email })
    if (existingall) {
        return res.json({
            success: false,
            message: 'user allready existed'
        })
    }
    const hash = bcrypt.hashSync(password, 10);

    let existingUser = await new User({
        email: email,
        password: hash,
        terms: terms
    })

    await existingUser.save()


    // token creat
    let token = jwt.sign({
        _id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })


    // email 
    emailSend(existingUser.email, token)
    res.json({
        success: true,
        message: 'registration successfull! please chek your email for veryfication',
        existingUser
    })


}

// verify email
const verifyEmailController = async (req, res) => {
    const { token } = req.params
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            return res.json({
                success: false,
                message: 'token invalid!'
            })
        }

        let userid = decoded.id
        let existing = await User.findOne({ _id: userid })

        if (!existing) {
            return res.json({
                success: false,
                message: 'invalid token'
            })
        }
        existing.isVerified = true
        await existing.save()
    })

    res.json({
        success: true,
        message: 'Email is Verified!'
    })

}

// login controller
const logincontroller = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json({
            success: false,
            message: 'please fillup the all fild'
        })
    }
    existingUser = await User.findOne({ email: email })

    if (!existingUser) {
        return res.json({
            success: false,
            message: 'invalid credenthial'
        })
    }

    let pass = bcrypt.compareSync(password, existingUser.password)
    if (!pass) {
        return res.json({
            success: false,
            message: 'invalid '
        })
    }
    let accesstoken = jwt.sign({
        id: existingUser._id,
        role: existingUser.role
    }, process.env.ACCESS_SECRET, {
        expiresIn: '1d'
    })

    res.json({
        success: true,
        message: 'login successfull!',
        token: accesstoken,
        data:{
            id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role,
            isVerified:existingUser.isVerified,
            status: existingUser.status,
            fristName: existingUser.fristName,
            lastName: existingUser.lastName,
            phonenumber: existingUser.phonenumber,
            billingAddress: existingUser.billingAddress
        }
    })

}


// forgot email controller
const forgotpasswordcontroller = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.json({
            success: false,
            message: 'please filup the email fild'
        })
    }
    let existignEmail = await User.findOne({ email: email })

    if (!existignEmail) {
        return res.json({
            success: false,
            message: 'user not found!'
        })
    }

    // reset token তৈরি করুন
    let resetToken = jwt.sign({
        id: existignEmail._id,
        email: existignEmail.email,
    }, process.env.JWT_SECRET, {
        expiresIn: '15m'
    })

    forgotemail(email, resetToken, existignEmail.fristName ? existignEmail.fristName : 'user')

    res.json({
        success: true,
        message: 'please chek your email for forgot password!'
    })
}


// reset password controller 
const resetpassword = async (req, res) => {
    const { newpassword, confrimnewpassword } = req.body
    const { token } = req.params

    if (!newpassword || !confrimnewpassword) {
        return res.json({
            success: false,
            message: 'please fill up the all fild'
        })
    }
    if (newpassword !== confrimnewpassword) {
        return res.json({
            success: false,
            message: 'confirmpassword not mach!'
        })
    }


    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
            return res.json({
                success: false,
                message: 'token invalid!'
            })
        }

        let userid = decoded.id
        let existing = await User.findOne({ _id: userid })

        if (!existing) {
            return res.json({
                success: false,
                message: 'invalid token'
            })
        }

        const hash = bcrypt.hashSync(newpassword, existing.password);
        existing.password = hash
        await existing.save()

        res.json({
            success: true,
            message: 'password reset successfull!'
        })
    })


}

// reverificathion 
const reverificathion = async (req, res) => {
    const { email } = req.body
    let existingUser = await User.findOne({ email: email })

    if (!existingUser) {
        return res.json({
            success: false,
            message: 'Invalid user'
        })
    }
    // token creat
    let token = jwt.sign({
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
    }, process.env.JWT_SECRET, {
        expiresIn: '4d'
    })

    emailSend(existingUser.email, token)

    res.json({
        success: true,
        message: 'Reverification email is send!'
    })

}

module.exports = { registrationController, verifyEmailController, logincontroller, forgotpasswordcontroller, resetpassword, reverificathion }