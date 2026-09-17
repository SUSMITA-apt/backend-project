const Category = require('../models/categoryModel')

let createCategory = async (req, res) => {
    try {
        let { name } = req.body

        let category = new Category({
            name: name,
        })

        await category.save()

        res.json({
            success: true,
            message: 'Category Created'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Category creation failed',
            error: error.message
        })
    }
}

// all category
let allCategory = async (req, res) => {
    try {
        let data = await Category.find({})

        res.json({
            success: true,
            message: 'All category collected',
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// delete category
let deleteCategory = async (req, res) => {
    try {
        let { id } = req.params

        let cata = await Category.findByIdAndDelete(id)

        res.json({
            success: true,
            message: 'Category Deleted',
            data: cata
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { createCategory, allCategory, deleteCategory }