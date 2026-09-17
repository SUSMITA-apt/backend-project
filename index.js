require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();

const mongodbConnect = require('./config/mongodbConnect');
const upload = require('./utils/storage');

const {
    registrationController,
    verifyEmailController,
    logincontroller,
    forgotpasswordcontroller,
    resetpassword,
    reverificathion
} = require('./controller/authController');

const { ProductController } = require('./controller/productController');

const {
    updateUser,
    alluser,
    singleuser,
    deleteuser,
    changepassword
} = require('./controller/userController');

const {
    createCategory,
    allCategory,
    deleteCategory
} = require('./controller/categoryController');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB connect
mongodbConnect();

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'API is running' });
});


// Authentication
app.post('/registration', registrationController);
app.post('/verifyemail/:token', verifyEmailController);
app.post('/login', logincontroller);
app.post('/forgotpassword', forgotpasswordcontroller);
app.post('/resetpassword/:token', resetpassword);
app.post('/reverificathion', reverificathion);


// User management
app.post('/user/:id', updateUser);
app.get('/alluser', alluser);
app.get('/user/:id', singleuser);
app.delete('/user/:id', deleteuser);
app.post('/user/pass/:id', changepassword);


// Category
app.post('/creat/category', createCategory);
app.delete('/delete/category/:id', deleteCategory);
app.get('/allcategory', allCategory);


// Product
app.post('/product', upload.array('images', 5), ProductController);

// Server
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is running! ${port}`);
});