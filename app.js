const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();
//midleware

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//áp dụng tour router cho mọi router bắt đầu bằng 'api/v1/tours
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

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
