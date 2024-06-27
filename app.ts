const express = require('express');

const app = express();

const bParser = require('body-parser');

const mongoose = require('mongoose');

const session = require('express-session');

const cors = require('cors');

const cookieParser = require('cookie-parser');

const MongoDBStore = require('connect-mongodb-session')(session);

const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');

const userRoutes = require('./routes/userRoutes');

dotenv.config();

const secret = process.env.SESSION_SECRET;
const mongoStore = new MongoDBStore({
    uri: process.env.MONGODB_SECRET,
    collection: "sessions"
});

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}))

app.use(cookieParser());
app.use(bParser.json());
app.use(bParser.urlencoded({extended: false}));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore
}))



app.use(authRoutes);

app.use(userRoutes);

mongoose.connect(process.env.MONGODB_SECRET).then((res:any)=>{
    app.listen(3000);
})
    .catch((err:any)=>{
        console.log(err);
        throw err;
    });



