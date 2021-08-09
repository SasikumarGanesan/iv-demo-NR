module.exports.successResponse = (res, statusCode, message, data) => {
  return res.status(statusCode || 200).json({
    status: true,
    message: message,
    data: data
  });
};

module.exports.errorResponse = (res, statusCode, message, data) => {
  return res.status(statusCode || 200).json({
    status: false,
    message: message,
    data: data
  });
};
