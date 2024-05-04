const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const viewRouter = require('./routes/viewRouter');

const hpp = require('hpp');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
//limit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests',
});

app.use('/api', limiter);

//midleware

//Reading data from req.body
app.use(express.json({ limit: '10kb' }));
//Data sanitiation against NoSql  query injection
app.use(mongoSanitize());

//Data sanitize against xss
app.use(xss());

// Prevent parameter polltuin
//cho phép tìm kiếm trùng lặp
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
//Serving statics files

//Test middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//áp dụng tour router cho mọi router bắt đầu bằng 'api/v1/tours

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//xử lí khi đường route không khớp với bất kì route nào được định nghĩa

app.all('*', (req, res, next) => {
  //Khi chưa có globalError
  //res.status(404).json({
  //status: 'failed',
  //message: "`Can't find ${req.originalUrl} on this server`"
  // })
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Middleware handle Error server
// Một khi hàm next trong đó truyền một đối tượng error lập tức sẽ
// được chuyển đếm middleware handle erorr để xử lí
app.use(globalErrorHandler);

module.exports = app;
