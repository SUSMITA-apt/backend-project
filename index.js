require('node:dns/promises').setServers([
    '1.1.1.1',
    '8.8.8.8'
])

require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

const mongodbConnect = require('./config/mongodbConnect')
const upload = require('./utils/storage')

const {
    registrationController,
    verifyEmailController,
    logincontroller,
    forgotpasswordcontroller,
    resetpassword,
    reverificathion
} = require('./controller/authController')

const { ProductController } = require('./controller/productController')

const {
    updateUser,
    alluser,
    singleuser,
    deleteuser,
    changepassword
} = require('./controller/userController')

const {
    createCategory,
    allCategory,
    deleteCategory
} = require('./controller/categoryController')

// ===============================
// Middleware
// ===============================

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// ===============================
// MongoDB Connection
// ===============================

mongodbConnect()

// ===============================
// Health Check
// ===============================

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running'
    })
})

// ===============================
// Authentication Routes
// ===============================

app.post('/registration', registrationController)

// IMPORTANT:
// Email links open through GET requests.
app.get('/verify-email/:token', verifyEmailController)

app.post('/login', logincontroller)

app.post('/forgotpassword', forgotpasswordcontroller)

app.post('/resetpassword/:token', resetpassword)

app.post('/reverificathion', reverificathion)

// ===============================
// User Management Routes
// ===============================

app.post('/user/:id', updateUser)

app.get('/alluser', alluser)

app.get('/user/:id', singleuser)

app.delete('/user/:id', deleteuser)

app.post('/user/pass/:id', changepassword)

// ===============================
// Category Routes
// ===============================

app.post('/creat/category', createCategory)

app.delete('/delete/category/:id', deleteCategory)

app.get('/allcategory', allCategory)

// ===============================
// Product Routes
// ===============================

app.post(
    '/product',
    upload.array('images', 5),
    ProductController
)

// ===============================
// Server
// ===============================

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server is running! ${port}`)
})