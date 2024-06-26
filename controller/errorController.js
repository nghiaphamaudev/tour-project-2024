const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: x. Please use another value different ${value}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

const handleJWTexprired = () =>
  new AppError('Your token has exprired! Please login again', 401);
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  //Tức là nếu lỗi xuất hiện cùng với 1 đường dẫn là api thì xuất lỗi
  // và not leak detail error
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    // ngược lại ở người dùng render ra 1 error page
  }
  console.log('ERROR🎇', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOpenrational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      //Programming or other unknown error: dont't leak errr details
    }
    console.log('ERROR🎇', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  //B) NOT API
  //A) Operational, trusted error: send message to client
  if (err.isOpenrational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
    });
  }
  //B) Progrmaming or other unknow error: don't leak error details
  console.log('ERROR🎇', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: 'Please try again later',
  });
};

//Trả về hai loại error cho dev và production

// err => lấy ra tất cả các thuộc tính của AppError
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTexprired();

    sendErrorProd(error, req, res);
  }
};

//Have 3 error in mongodb
//Mục đích là biến đổi message sao cho người dùng có thể đọc được >>>
