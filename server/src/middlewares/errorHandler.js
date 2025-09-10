// middleware/errorHandler.js

const express = require('express');
module.exports = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(400).json({
    message: err.message || 'Unexpected error',
  });
}
