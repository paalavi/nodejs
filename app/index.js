const express = require('express'),
  http = require('http'),
  cookieParser = require('cookie-parser'),
  validator = require('express-validator'),
  session = require('express-session'),
  mongoStore = require('connect-mongo')(session),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  path = require('path'),
  bodyParser = require('body-parser');
let loginByToken=require('./middlewares/loginByToken');

const app = express();


module.exports = class Application {
  constructor() {
    this.setupExpress();
    this.setMongoDB();
    this.setExpressConfig();
    this.setRoutes();
  }

  setupExpress() {
    const server = http.createServer(app);
    server.listen(3000, () => console.log('serer is running on port 3000'))
  }

  async setMongoDB() {
    try {
      await mongoose.connect('mongodb://localhost:27017/node_cms', {
        useNewUrlParser: true
      });
      console.log('mongoDB connected successfully');
    } catch (error) {
      console.log('================================================');
      console.log(error.message);
      console.log('================================================');
      process.exit(1)
    }
  }

  setExpressConfig() {
    //#region view engin
    app.set('view engine', 'ejs');
    app.set('views', (path.resolve('resourses/views')));
    app.use(express.static(path.resolve('public')));
    //#endregion
    //#region bodyParser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    //#endregion
    //#region validator
    app.use(validator());
    //#endregion
    //#region session-cookie
    app.use(session({
      secret: 'cmsSecretKey',
      resave: true,
      saveUninitialized: true,
      store: new mongoStore({
        mongooseConnection: mongoose.connection
      }),
    }));
    app.use(cookieParser('cmsSecretKey'));
    //#endregion
    //#region flash
    app.use(flash());
    //#endregion
    //#region passport
    app.use(passport.initialize());
    app.use(passport.session());
    require('./passport/passport-local');
    require('./passport/passport-google');
    //#endregion
    app.use((req, res, next) => {
      app.locals = {
        auth: {
          user: req.user,
          checked: req.isAuthenticated()
        }
      };
      next()
    });
  }

  setRoutes() {
    app.use(loginByToken.handle);
    app.use(require('./routes/web/index'));
    app.use(require('./routes/api/index'));
  }
};