const User = require('../models/User');
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');

exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUrls = await Url.countDocuments();
    const totalClicks = await Url.aggregate([{ $group: { _id: null, total: { $sum: '$clicks' } } }]);
    const activeUrls = await Url.countDocuments({ isActive: true });
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const recentUrls = await Url.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const recentClicks = await Analytics.countDocuments({ timestamp: { $gte: thirtyDaysAgo } });
    const topUrls = await Url.find().sort({ clicks: -1 }).limit(10).populate('userId', 'name email');
    res.status(200).json({
      success: true,
      data: {
        totalUsers, totalUrls, totalClicks: totalClicks[0]?.total || 0, activeUrls,
        recentUsers, recentUrls, recentClicks,
        topUrls: topUrls.map(url => ({
          id: url._id, originalUrl: url.originalUrl, shortCode: url.shortCode, clicks: url.clicks,
          user: url.userId ? { name: url.userId.name, email: url.userId.email } : null, createdAt: url.createdAt
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const users = await User.find().sort({ createdAt: -1 }).limit(limit).skip(skip);
    const total = await User.countDocuments();
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const urlCount = await Url.countDocuments({ userId: user._id });
      const urls = await Url.find({ userId: user._id });
      const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
      return { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive,
        createdAt: user.createdAt, urlCount, totalClicks };
    }));
    res.status(200).json({
      success: true, data: usersWithStats,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUrls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const urls = await Url.find().sort({ createdAt: -1 }).limit(limit).skip(skip).populate('userId', 'name email');
    const total = await Url.countDocuments();
    const urlsWithShortUrl = urls.map(url => ({
      id: url._id, originalUrl: url.originalUrl, shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode, clicks: url.clicks, isActive: url.isActive,
      user: url.userId ? { name: url.userId.name, email: url.userId.email } : null, createdAt: url.createdAt
    }));
    res.status(200).json({
      success: true, data: urlsWithShortUrl,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const url = await Url.findById(id);
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    await Analytics.deleteMany({ urlId: url._id });
    await Url.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    await user.save();
    res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
