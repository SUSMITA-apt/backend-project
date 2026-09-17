let User = require('../models/userModel')
let bcrypt = require('bcryptjs')


// update user
let updateUser = async (req, res) => {
    let { id } = req.params
    try {
        let data = await User.findByIdAndUpdate({ _id: id }, req.body, { new: true }).select("-password")
        res.json({
            success: true,
            message: 'user update successfully',
            data: data
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'user not update',
        })
    }
}


// all user
let alluser = async (req, res) => {
    let data = await User.find({})
    try {
        res.json({
            success: true,
            message: 'all user',
            data: data
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'user not found',
        })
    }
}


// get single user 
let singleuser = async (req, res) => {
    let { id } = req.params
    let data = await User.findById({ _id: id })
    try {
        res.json({
            success: true,
            message: 'single user',
            data: data
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'user not found',
        })
    }
}

// delete user 

let deleteuser = async (req, res) => {
    let { id } = req.params
    let data = await User.findByIdAndDelete({ _id: id })
    try {
        res.json({
            success: true,
            message: 'user delete successfully',
        })
    } catch (error) {
        res.json({
            success: false,
            message: 'user not delete',
        })
    }
}


// change password
let changepassword = async (req, res) => {
    let { id } = req.params
    let { currentPassword, newPassword, confirmPassword } = req.body

    existingUser = await User.findOne({_id: id})

    if (!existingUser) {
        return res.json({
            success: false,
            message: 'invalid user'
        })
    }

    let pass = bcrypt.compareSync(currentPassword, existingUser.password)
    if (!pass) {
        return res.json({
            success: false,
            message: 'current password not match'
        })
    }
    if( newPassword !==  confirmPassword){
        return res.json({
            success: false,
            message: 'confirmpassword not match'
        })
    }
    const hash = bcrypt.hashSync(newPassword, 10);

    let data = await User.findByIdAndUpdate({_id: id}, {password: hash}, {new: true})
    res.json({
        success: true,
        message: "password update suscesfull"
    })
}
module.exports = { updateUser, alluser, singleuser, deleteuser,changepassword }