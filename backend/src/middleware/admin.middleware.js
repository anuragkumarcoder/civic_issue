/**
 * Admin middleware
 * Checks if the authenticated user has admin role
 */
module.exports = (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized. Admin access required',
    });
  }

  next();
};