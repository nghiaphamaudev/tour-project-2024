module.exports = catchAsync = (fn) => {
  //middleware này sẽ nhận các tham số trực tiếp từ route express
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
