const User = require('../models/userModel');
const bcrypt = require('bcryptjs');


// =========================
// Update User
// =========================
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await User.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data
        });

    } catch (error) {
        console.error('Update User Error:', error);

        return res.status(500).json({
            success: false,
            message: 'User update failed',
            error: error.message
        });
    }
};


// =========================
// Get All Users
// =========================
const alluser = async (req, res) => {
    try {
        const data = await User.find({}).select('-password');

        return res.status(200).json({
            success: true,
            message: 'All users retrieved successfully',
            data
        });

    } catch (error) {
        console.error('Get All Users Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve users',
            error: error.message
        });
    }
};


// =========================
// Get Single User
// =========================
const singleuser = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await User.findById(id).select('-password');

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data
        });

    } catch (error) {
        console.error('Get Single User Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve user',
            error: error.message
        });
    }
};


// =========================
// Delete User
// =========================
const deleteuser = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await User.findByIdAndDelete(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete User Error:', error);

        return res.status(500).json({
            success: false,
            message: 'User deletion failed',
            error: error.message
        });
    }
};


// =========================
// Change Password
// =========================
const changepassword = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        // Validate fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all password fields'
            });
        }

        // Check new passwords
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New passwords do not match'
            });
        }

        // Find user
        const existingUser = await User.findById(id);

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'Invalid user'
            });
        }

        // Check current password
        const passwordMatch = await bcrypt.compare(
            currentPassword,
            existingUser.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const hash = await bcrypt.hash(newPassword, 10);

        existingUser.password = hash;

        await existingUser.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Change Password Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Password update failed',
            error: error.message
        });
    }
};


module.exports = {
    updateUser,
    alluser,
    singleuser,
    deleteuser,
    changepassword
};