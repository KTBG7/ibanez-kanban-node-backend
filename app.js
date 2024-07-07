"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helperFunctions_1 = require("./utils/helperFunctions");
var express = require('express');
var app = express();
var bParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var MongoDBStore = require('connect-mongodb-session')(session);
var dotenv = require('dotenv');
var authRoutes = require('./routes/authRoutes');
var userRoutes = require('./routes/userRoutes');
var helmet = require('helmet');
dotenv.config();
var secret = process.env.SESSION_SECRET;
var mongoStore = new MongoDBStore({
    uri: process.env.MONGODB_SECRET,
    collection: "sessions"
});
app.set('trust proxy', 1);
app.use(cors({
    origin: process.env.UI_DOMAIN,
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200
}));
app.use(helmet());
app.use(cookieParser(secret));
app.use(bParser.json());
app.use(bParser.urlencoded({ extended: false }));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { sameSite: "strict", path: "/", httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 }
}));
app.use(helperFunctions_1.findSession);
app.use(authRoutes);
app.use(userRoutes);
mongoose.connect(process.env.MONGODB_SECRET).then(function (res) {
    app.listen(process.env.PORT || 3000);
})
    .catch(function (err) {
    console.log(err);
    throw err;
});
