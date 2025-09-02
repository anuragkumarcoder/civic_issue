const express = require('express');
const { body } = require('express-validator');
const issueController = require('../controllers/issue.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const router = express.Router();

/**
 * @swagger
 * /api/issues:
 *   get:
 *     summary: Get all issues
 *     tags: [Issues]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [REPORTED, UNDER_REVIEW, IN_PROGRESS, RESOLVED, CLOSED]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [ROADS, WATER, ELECTRICITY, SANITATION, PUBLIC_SAFETY, ENVIRONMENT, PUBLIC_PROPERTY, OTHER]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of issues
 */
router.get('/', issueController.getAllIssues);

/**
 * @swagger
 * /api/issues/{id}:
 *   get:
 *     summary: Get issue by ID
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Issue details
 *       404:
 *         description: Issue not found
 */
router.get('/:id', issueController.getIssueById);

/**
 * @swagger
 * /api/issues:
 *   post:
 *     summary: Create a new issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [ROADS, WATER, ELECTRICITY, SANITATION, PUBLIC_SAFETY, ENVIRONMENT, PUBLIC_PROPERTY, OTHER]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Issue created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 */
router.post(
  '/',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('category').isIn([
      'ROADS',
      'WATER',
      'ELECTRICITY',
      'SANITATION',
      'PUBLIC_SAFETY',
      'ENVIRONMENT',
      'PUBLIC_PROPERTY',
      'OTHER',
    ]).withMessage('Invalid category'),
  ],
  issueController.createIssue
);

/**
 * @swagger
 * /api/issues/{id}:
 *   put:
 *     summary: Update an issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [REPORTED, UNDER_REVIEW, IN_PROGRESS, RESOLVED, CLOSED]
 *               category:
 *                 type: string
 *                 enum: [ROADS, WATER, ELECTRICITY, SANITATION, PUBLIC_SAFETY, ENVIRONMENT, PUBLIC_PROPERTY, OTHER]
 *     responses:
 *       200:
 *         description: Issue updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Issue not found
 */
router.put('/:id', authMiddleware, issueController.updateIssue);

/**
 * @swagger
 * /api/issues/{id}:
 *   delete:
 *     summary: Delete an issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Issue deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Issue not found
 */
router.delete('/:id', authMiddleware, issueController.deleteIssue);

/**
 * @swagger
 * /api/issues/{id}/upvote:
 *   post:
 *     summary: Upvote an issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Issue upvoted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Issue not found
 */
router.post('/:id/upvote', authMiddleware, issueController.upvoteIssue);

/**
 * @swagger
 * /api/issues/{id}/comments:
 *   post:
 *     summary: Add a comment to an issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Issue not found
 */
router.post(
  '/:id/comments',
  authMiddleware,
  [
    body('content').notEmpty().withMessage('Comment content is required'),
  ],
  issueController.addComment
);

/**
 * @swagger
 * /api/issues/{id}/comments:
 *   get:
 *     summary: Get all comments for an issue
 *     tags: [Issues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *       404:
 *         description: Issue not found
 */
router.get('/:id/comments', issueController.getComments);

module.exports = router;