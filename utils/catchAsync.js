module.exports = catchAsync = (fn) => {
  //middleware này sẽ nhận các tham số trực tiếp từ route express
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
//module.exports = catchAsync = (fn) => {
//middleware này sẽ nhận các tham số trực tiếp từ route express
//   return (req, res, next) => {
//gọi 1 hàm callback trong đó hàm này là 1 hàm ẩn danh nhận các tham số truyền vào là
//các gia trị nhận từ router
//     fn(req, res, next).catch((err) => next(err));
//sau khi hàm bất đồng bộ fn chạy xong sẽ trả về 1 promise
//nếu có lỗi thì bắt ngay lập tức
//   };
// };
