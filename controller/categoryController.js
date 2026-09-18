const Category = require('../models/categoryModel');


// =========================
// Create Category
// =========================
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate category name
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const category = new Category({
            name: name.trim()
        });

        await category.save();

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });

    } catch (error) {
        console.error('Create Category Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Category creation failed',
            error: error.message
        });
    }
};


// =========================
// Get All Categories
// =========================
const allCategory = async (req, res) => {
    try {
        const data = await Category.find({});

        return res.status(200).json({
            success: true,
            message: 'All categories retrieved successfully',
            data
        });

    } catch (error) {
        console.error('Get Categories Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve categories',
            error: error.message
        });
    }
};


// =========================
// Delete Category
// =========================
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required'
            });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: category
        });

    } catch (error) {
        console.error('Delete Category Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: error.message
        });
    }
};


module.exports = {
    createCategory,
    allCategory,
    deleteCategory
};