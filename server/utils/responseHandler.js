const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

const errorResponse = (res, message = 'Error occurred', statusCode = 400) => {
  return res.status(statusCode).json({
    status: 'error',
    message
  });
};

module.exports = { successResponse, errorResponse }; 