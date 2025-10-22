const express = require('express');
const router = express.Router();
const {
  getSystemStats,
  getAllUsers,
  getAllUrls,
  deleteUrl,
  updateUserRole
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);
router.get('/urls', getAllUrls);
router.delete('/urls/:id', deleteUrl);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
