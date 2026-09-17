const Product = require('../models/productModel')

const ProductController = async (req, res) => {
    const { title, description, price, discundprice, catagory, stock, sku, images, status, tags, weight, slug } = req.body


    if (!title || !price) {
        return res.json({
            success: false,
            message: 'title and price is requied!'
        })
    }

    // slug create
    let Slug = title.toLowerCase().split(' ').join('-')
    // আগে থেকে database এ এই title এ কোন slug আছে কিনা চেক করতে হবে 
    let existingSlug = Product.findOne({ slug: Slug })

    // না থাকলে database এ সেভ করতে হবে 
    let product = new Product({
        title: title,
        description: description,
        price: price,
        discundprice: discundprice,
        catagory: catagory,
        stock: stock,
        sku: sku,
        images: images,
        status: status,
        tags: tags,
        weight: weight,
        slug: slug
    })
    await product.save
}

// প্রোডাক্ট আছে কিনা চেক করার জন্য 
let getProductId = async (req, res) => {
    let { id } = req.body

    let data = await Product.findById({ id })
    if (!data) {
        return res.json({
            success: false,
            message: 'no found product!'
        })
    }
    res.json({
        success: true,
        data
    })

}

// সকল প্রোডাক্ট নিয়ে আসার জন্য 

const getAllProduct = (req,res)=>{
     
}




module.exports = { ProductController }