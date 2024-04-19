const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find(); //Lấy ra chuỗi truy vấn

  //SEND RESPOND
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This router not yet defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This router not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This router not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This router not yet defined',
  });
};
