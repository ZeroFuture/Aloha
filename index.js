const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const cors = require("cors");
const passport = require('passport');
const socketIO = require('socket.io');
const router = require('express-promise-router')();
const container = require('./container');
const Channel = require('./models/channel');
require('./passport/passport-local');


container.resolve(function(_, userController, channelController, friendController) {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/aloha', {useNewUrlParser: true, useUnifiedTopology: true});

    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);
    const p2p = require('socket.io-p2p-server').Server;
    // io.use(p2p);

    server.listen(process.env.PORT || 8080, function(){
        console.log('Listening on port 8080');
    });

    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(
        cors({
          origin: "http://localhost:3000", // allow to server to accept request from different origin
          methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
          credentials: true // allow session cookie from browser to pass through
        })
    );
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    
    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection})
    }));

    
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.locals._ = _;

    require('./socket/channelSocket')(io, Channel);
    require('./socket/userSocket')(io);

    userController.route(router);
    channelController.route(router);
    friendController.route(router);

    app.use(router);
});