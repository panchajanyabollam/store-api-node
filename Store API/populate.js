require('dotenv').config()

const connectDB = require('./db/connect')

const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany(); // delete previous products 
        await Product.create(jsonProducts); // adding the JSON Data.
        console.log("connection sucessful");
        process.exit(0); // everything went well

    } catch (erorr) {
        console.log(error)
        process.exit(1); // everything didnt went well
    }
}
start();