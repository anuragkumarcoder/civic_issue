const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

/**
 * Get all users (admin only)
 * @route GET /api/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { issues: true },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user is authorized to view this user
    // Users can only view their own profile unless they are admins
    if (id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this user',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { issues: true, comments: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @route PUT /api/users/:id
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, profilePicture } = req.body;

    // Check if user is authorized to update this user
    // Users can only update their own profile unless they are admins
    if (id !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this user',
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        profilePicture,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get issues reported by a user
 * @route GET /api/users/:id/issues
 */
exports.getUserIssues = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user is authorized to view this user's issues
    // Users can only view their own issues unless they are admins or officials
    if (
      id !== req.user.id &&
      req.user.role !== 'ADMIN' &&
      req.user.role !== 'OFFICIAL'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this user\'s issues',
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Get issues
    const issues = await prisma.issue.findMany({
      where: { reporterId: id },
      include: {
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: issues.length,
      data: {
        issues,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role (admin only)
 * @route PUT /api/users/:id/role
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['CITIZEN', 'OFFICIAL', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role',
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};