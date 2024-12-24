require('dotenv').config();

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const connectToMongo = require('./connection/connection.js');
require('dotenv').config();

//calling paths
const userRouter = require('./Router/User.js');
const courseRoutes = require('./Router/courseRouter.js');
const adminRoutes = require('./Router/adminRouter.js');
const productRoutes = require('./Router/ProductRouter.js');
const notificationRoutes = require('./Router/notification.js');
const blogRoutes = require('./Router/blogRouter.js');
const contactRouter = require('./Router/contactRouter.js');
const Wishlist = require('./Router/wishlistRouter.js');
const cvFormRouter = require('./Router/cvFormRouter.js');
const counterRoutes = require('./Router/counterRouter.js');


//calling middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle POST requests for contact
app.post("/contact", contactRouter);
// blog routes
app.use('/', blogRoutes);

//Wishlish
app.use('/wishlists', Wishlist);

// notifications
app.use('/notifications', notificationRoutes);

// product routes
app.use('/', productRoutes);

// Admin routes
app.use('/',adminRoutes);

// Authentication & User Managemenst
app.use('/',userRouter);

// Course Management
app.use('/',courseRoutes);

// Counter Management
app.use('/',counterRoutes);

// Use the job application routes
app.use('/cvForm', cvFormRouter);
// Serve static files
app.use('/uploads', express.static('uploads'));

// for testing 
app.get('/test', (req, res) => {
  res.send('Welcome to the server');
});

// calling connection server which is listen on port 
connectToMongo();
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server is starting ${port} ||  http://localhost:${port}`)
});