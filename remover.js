const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const { config } = require('dotenv');

// load env vars and make it load the files
config();

// load mmodel
const User = require('./src/models/User.model');


const options = {
    useNewUrlParser: true,
    useCreateindex: true,
    autoIndex: true,
    poolSize: 10,
    keepAlive: true,
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4, // use IPv4, skip trying IPv6
    useFindAndModify: false,
    useUnifiedTopology: true
}

const connectDB = () => {
    //connect to DB
    if(process.env.NODE_ENV === 'test') {
        mongoose.connect(process.env.MONGODB_TEST_URI, options)
    }

    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'){
        mongoose.connect(process.env.MONGODB_URI, options)
    }
}

// Delete the data
const deleteData = async () => {
    try {
        await connectDB();
        await User.deleteMany();

        console.log('Data destroyed successfully...'.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if(process.argv[2] === '-d'){
    deleteData();
}