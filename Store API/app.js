require('dotenv').config()
require('express-async-errors')


//async errors



const express = require('express');
const app = express();

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')


const notFoundMiddleWare = require('./middleware/not-found')
const errordMiddleWare = require('./middleware/error-handler')

//middleware
app.use(express.json())

//routes

app.get('/', (req, res) => {
    res.send("<h1>Store API</h1><a href='/api/v1/products'>products route</a>")
})

app.use('/api/v1/products',productsRouter)

//products route

app.use(notFoundMiddleWare)
app.use(errordMiddleWare)

const port = process.env.PORT || 3000


const start = async () => {
    try {
        //connect DB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log("Listening to port "+port))
    } catch (error) {
        console.log(error);
    }
}
start();



