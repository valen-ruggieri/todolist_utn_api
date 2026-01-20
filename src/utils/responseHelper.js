function sendSuccess(res, data = null, status = 200, meta = null) {
  const payload = { success: true, data };
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
}

function sendError(res, message = 'Error', status = 400, code = null, details = null) {
  const payload = {
    success: false,
    error: {
      message,
    },
  };
  if (code) payload.error.code = code;
  if (details) payload.error.details = details;
  return res.status(status).json(payload);
}

module.exports = { sendSuccess, sendError };

