function paginate(req, res, next) {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '50', 10)));
  req.pagination = { page, limit, skip: (page - 1) * limit };
  next();
}

module.exports = paginate;
