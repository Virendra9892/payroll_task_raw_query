var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const models = require("./models")
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const swaggerUi = require('swagger-ui-express');
const swagger = require('./utils/swagger');

// const option = {
//      definition:{
//       operapi:'3.0.0',
//       info: {
//         title:"Payroll task",
//         version:"1.0.0"
//       },
//       servers:[
//         {
//           url:"http://localhost:3000/"
//         }
//       ]
//      },
//      apis:["./app.js"]
// }
// let swaggerSpec = swaggerJsDoc(option);
// app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger.swaggerSpec));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const redis = require("./utils/redis")
app.use('/api', indexRouter);
// app.use('/users', usersRouter);
models.sequelize.authenticate().then(()=>{
  console.log(`db synced`);
}).catch((err)=>{
  console.log(`db connection failed due to some ${err}`);
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
