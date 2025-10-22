const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  bulkShortenUrls,
  getUserUrls,
  getUrlDetails,
  updateUrl,
  deleteUrl,
  getQRCode
} = require('../controllers/urlController');
const { protect, optionalAuth } = require('../middleware/auth');
const { createUrlLimiter } = require('../middleware/rateLimit');

/**
 * @swagger
 * /api/urls/shorten:
 *   post:
 *     summary: Create a short URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *               customAlias:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               title:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: URL shortened successfully
 */
router.post('/shorten', createUrlLimiter, optionalAuth, shortenUrl);

/**
 * @swagger
 * /api/urls/bulk:
 *   post:
 *     summary: Bulk shorten URLs
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - urls
 *             properties:
 *               urls:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Bulk shortening completed
 */
router.post('/bulk', protect, bulkShortenUrls);

/**
 * @swagger
 * /api/urls:
 *   get:
 *     summary: Get user's URLs
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of URLs
 */
router.get('/', protect, getUserUrls);

/**
 * @swagger
 * /api/urls/{shortCode}:
 *   get:
 *     summary: Get URL details
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL details
 */
router.get('/:shortCode', protect, getUrlDetails);

/**
 * @swagger
 * /api/urls/{id}:
 *   put:
 *     summary: Update URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 */
router.post('/shorten', createUrlLimiter, optionalAuth, shortenUrl);
router.post('/bulk', protect, bulkShortenUrls);
router.get('/', protect, getUserUrls);
router.get('/:shortCode', protect, getUrlDetails);
router.put('/:id', protect, updateUrl);
router.delete('/:id', protect, deleteUrl);
router.get('/:shortCode/qr', getQRCode);

module.exports = router;