const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config();
const cors = require('cors')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/products')



app = express()

app.use(express.json())

app.use(express.urlencoded({
    extended: true
}));

app.use(cors())

const mongoString = process.env.DbUrl

try {
    mongoose.connect(mongoString, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("connected to db");
} catch (error) {
    console.log(error);
}

process.on('uncaughtException', error => {
    console.log('uncaughtException', error.message);
});

app.use('/api/v1',userRoutes)
app.use('/api/v1',productRoutes)


const port = process.env.PORT

app.listen(port, () => {
    console.log('server listen on', port);
})
