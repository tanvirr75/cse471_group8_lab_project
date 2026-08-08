module.exports = function devAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) {
    return res.status(401).json({ message: "Missing x-user-id header (dev auth stub)" });
  }
  req.user = { id: userId };
  next();
};
