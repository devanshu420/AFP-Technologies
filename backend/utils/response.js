export function successResponse(res, data = null, message = 'Success', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(res, message = 'An error occurred', status = 500, errorCode = 'SERVER_ERROR', fields = {}) {
  return res.status(status).json({
    success: false,
    message,
    error: {
      code: errorCode,
      fields,
    },
  });
}