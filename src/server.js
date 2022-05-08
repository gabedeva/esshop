const app = require('./config/app');
const connectDB = require('./config/db');
const colors = require('colors');

const connect = async() => {

    // connect to DB
    await connectDB();

    // seed data to db

}

connect();

// define PORT
const PORT = process.env.PORT || 5000;

// create server
const server = app.listen(PORT, 
    console.log(`eshop running in ${process.env.NODE_ENV} mode on port ${PORT}`.orange.bold
));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
})