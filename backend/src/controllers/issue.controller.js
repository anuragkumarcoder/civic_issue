const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const { sendIssueCreatedEmail, sendStatusUpdateEmail, sendAdminNotificationEmail } = require('../mailer');

const prisma = new PrismaClient();

/**
 * Get all issues with pagination and filtering
 * @route GET /api/issues
 */
exports.getAllIssues = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    // Get issues with pagination
    const issues = await prisma.issue.findMany({
      where: filter,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: parseInt(limit),
    });

    // Get total count for pagination
    const total = await prisma.issue.count({ where: filter });

    res.status(200).json({
      status: 'success',
      results: issues.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: {
        issues,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get issue by ID
 * @route GET /api/issues/:id
 */
exports.getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!issue) {
      return res.status(404).json({
        status: 'error',
        message: 'Issue not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        issue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new issue
 * @route POST /api/issues
 */
exports.createIssue = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, location, latitude, longitude, category, images = [] } = req.body;

    // Create issue
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        location,
        latitude,
        longitude,
        category,
        images,
        reporterId: req.user.id,
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send confirmation email to user
    try {
      await sendIssueCreatedEmail(issue.reporter.email, issue.reporter.name, issue);
    } catch (emailError) {
      console.error('Failed to send issue creation email:', emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admins
    try {
      await sendAdminNotificationEmail(issue);
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      status: 'success',
      data: {
        issue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an issue
 * @route PUT /api/issues/:id
 */
exports.updateIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, category } = req.body;

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!existingIssue) {
      return res.status(404).json({
        status: 'error',
        message: 'Issue not found',
      });
    }

    // Check if user is authorized to update the issue
    // Only the reporter, officials, or admins can update issues
    if (
      existingIssue.reporterId !== req.user.id &&
      req.user.role !== 'OFFICIAL' &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this issue',
      });
    }

    // Check if status is being updated
    const statusChanged = status && status !== existingIssue.status;
    const oldStatus = existingIssue.status;

    // Update issue
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        title,
        description,
        status,
        category,
      },
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send status update email if status changed
    if (statusChanged) {
      try {
        await sendStatusUpdateEmail(
          updatedIssue.reporter.email,
          updatedIssue.reporter.name,
          updatedIssue,
          oldStatus,
          status
        );
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        issue: updatedIssue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an issue
 * @route DELETE /api/issues/:id
 */
exports.deleteIssue = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id },
    });

    if (!existingIssue) {
      return res.status(404).json({
        status: 'error',
        message: 'Issue not found',
      });
    }

    // Check if user is authorized to delete the issue
    // Only the reporter or admins can delete issues
    if (existingIssue.reporterId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this issue',
      });
    }

    // Delete all comments related to the issue
    await prisma.comment.deleteMany({
      where: { issueId: id },
    });

    // Delete issue
    await prisma.issue.delete({
      where: { id },
    });

    res.status(200).json({
      status: 'success',
      message: 'Issue deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upvote an issue
 * @route POST /api/issues/:id/upvote
 */
exports.upvoteIssue = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id },
    });

    if (!existingIssue) {
      return res.status(404).json({
        status: 'error',
        message: 'Issue not found',
      });
    }

    // Increment upvotes
    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        upvotes: { increment: 1 },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        issue: updatedIssue,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a comment to an issue
 * @route POST /api/issues/:id/comments
 */
exports.addComment = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { content } = req.body;

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id },
    });

    if (!existingIssue) {
      return res.status(404).json({
        status: 'error',
        message: 'Issue not found',
      });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        issueId: id,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all comments for an issue
 * @route GET /api/issues/:id/comments
 */
exports.getComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if issue exists
    const existingIssue = await prisma.issue.findUnique({
      where: { id },
    });

    if (!existingIssue) {
      return res.status(404).json({
        status: 'error',
        message: 'Issue not found',
      });
    }

    // Get comments
    const comments = await prisma.comment.findMany({
      where: { issueId: id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: {
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};