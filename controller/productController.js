const Product = require('../models/productModel');


// =========================
// Create Product
// =========================
const ProductController = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            discundprice,
            catagory,
            stock,
            sku,
            images,
            status,
            tags,
            weight,
            slug
        } = req.body;

        // Validate required fields
        if (!title || price === undefined || price === null) {
            return res.status(400).json({
                success: false,
                message: 'Title and price are required'
            });
        }

        // Create slug from title if slug is not provided
        const productSlug = slug
            ? slug.toLowerCase().trim()
            : title
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-');

        // Check duplicate slug
        const existingSlug = await Product.findOne({
            slug: productSlug
        });

        if (existingSlug) {
            return res.status(409).json({
                success: false,
                message: 'A product with this slug already exists'
            });
        }

        // Create product
        const product = new Product({
            title: title.trim(),
            description,
            price,
            discundprice,
            catagory,
            stock,
            sku,
            images,
            status,
            tags,
            weight,
            slug: productSlug
        });

        await product.save();

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });

    } catch (error) {
        console.error('Create Product Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Product creation failed',
            error: error.message
        });
    }
};


// =========================
// Get Single Product
// =========================
const getProductId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const data = await Product.findById(id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Get Product Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to get product',
            error: error.message
        });
    }
};


// =========================
// Get All Products
// =========================
const getAllProduct = async (req, res) => {
    try {
        const data = await Product.find({});

        return res.status(200).json({
            success: true,
            message: 'All products retrieved successfully',
            data
        });

    } catch (error) {
        console.error('Get All Products Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve products',
            error: error.message
        });
    }
};


module.exports = {
    ProductController,
    getProductId,
    getAllProduct
};