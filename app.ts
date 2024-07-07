import {findSession} from "./utils/helperFunctions";

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

const helmet = require('helmet');

dotenv.config();

const secret = process.env.SESSION_SECRET;
const mongoStore = new MongoDBStore({
    uri: process.env.MONGODB_SECRET,
    collection: "sessions"
});

app.set('trust proxy', 1);


app.use(cors({
    origin: process.env.UI_DOMAIN,
    credentials: true
}));

app.use(helmet())

app.use(cookieParser(secret));
app.use(bParser.json());
app.use(bParser.urlencoded({extended: false}));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { sameSite: "strict", path: "/", httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(200);
});

app.use(findSession);

app.use(authRoutes);

app.use(userRoutes);

mongoose.connect(process.env.MONGODB_SECRET).then((res:any)=>{
    app.listen(process.env.PORT || 3000);
})
    .catch((err:any)=>{
        console.log(err);
        throw err;
    });


