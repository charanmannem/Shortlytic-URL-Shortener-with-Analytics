const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const { generateUniqueCode } = require('../utils/base62');
const { generateQRCode } = require('../utils/qrcode');
const { getLocationFromIP, parseUserAgent, getClientIP } = require('../utils/geoip');

exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresAt, title, tags } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ success: false, message: 'Original URL is required' });
    }
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(originalUrl)) {
      return res.status(400).json({ success: false, message: 'Invalid URL format' });
    }
    let shortCode;
    if (customAlias) {
      if (!/^[a-zA-Z0-9_-]+$/.test(customAlias)) {
        return res.status(400).json({ success: false, message: 'Custom alias can only contain letters, numbers, hyphens, and underscores' });
      }
      const existingUrl = await Url.findOne({ $or: [{ shortCode: customAlias }, { customAlias }] });
      if (existingUrl) {
        return res.status(400).json({ success: false, message: 'Custom alias is already taken' });
      }
      shortCode = customAlias;
    } else {
      let isUnique = false;
      while (!isUnique) {
        shortCode = generateUniqueCode();
        const existing = await Url.findOne({ shortCode });
        if (!existing) isUnique = true;
      }
    }
    const url = await Url.create({
      originalUrl: originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`,
      shortCode,
      customAlias: customAlias || null,
      userId: req.user ? req.user.id : null,
      expiresAt: expiresAt || null,
      title: title || null,
      tags: tags || []
    });
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: { id: url._id, originalUrl: url.originalUrl, shortUrl, shortCode: url.shortCode, customAlias: url.customAlias, clicks: url.clicks, createdAt: url.createdAt, expiresAt: url.expiresAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkShortenUrls = async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of URLs' });
    }
    if (urls.length > 50) {
      return res.status(400).json({ success: false, message: 'Maximum 50 URLs allowed per bulk request' });
    }
    const results = [];
    const errors = [];
    for (let i = 0; i < urls.length; i++) {
      const originalUrl = urls[i];
      try {
        let shortCode;
        let isUnique = false;
        while (!isUnique) {
          shortCode = generateUniqueCode();
          const existing = await Url.findOne({ shortCode });
          if (!existing) isUnique = true;
        }
        const url = await Url.create({
          originalUrl: originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`,
          shortCode,
          userId: req.user.id
        });
        results.push({ originalUrl: url.originalUrl, shortUrl: `${process.env.BASE_URL}/${shortCode}`, shortCode: url.shortCode });
      } catch (error) {
        errors.push({ url: originalUrl, error: error.message });
      }
    }
    res.status(201).json({
      success: true,
      message: `Bulk URL shortening completed. ${results.length} successful, ${errors.length} failed`,
      data: { successful: results, failed: errors }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(limit).skip(skip);
    const total = await Url.countDocuments({ userId: req.user.id });
    const urlsWithShortUrl = urls.map(url => ({
      id: url._id, originalUrl: url.originalUrl, shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      shortCode: url.shortCode, customAlias: url.customAlias, clicks: url.clicks, isActive: url.isActive,
      expiresAt: url.expiresAt, title: url.title, tags: url.tags, createdAt: url.createdAt
    }));
    res.status(200).json({
      success: true, data: urlsWithShortUrl,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUrlDetails = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    if (req.user && url.userId && url.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this URL' });
    }
    res.status(200).json({
      success: true,
      data: {
        id: url._id, originalUrl: url.originalUrl, shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        shortCode: url.shortCode, customAlias: url.customAlias, clicks: url.clicks, isActive: url.isActive,
        expiresAt: url.expiresAt, title: url.title, tags: url.tags, createdAt: url.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tags, isActive, expiresAt } = req.body;
    const url = await Url.findById(id);
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    if (url.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this URL' });
    }
    if (title !== undefined) url.title = title;
    if (tags !== undefined) url.tags = tags;
    if (isActive !== undefined) url.isActive = isActive;
    if (expiresAt !== undefined) url.expiresAt = expiresAt;
    await url.save();
    res.status(200).json({ success: true, message: 'URL updated successfully', data: url });
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
    if (url.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this URL' });
    }
    await Analytics.deleteMany({ urlId: url._id });
    await Url.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQRCode = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const qrCode = await generateQRCode(shortUrl);
    res.status(200).json({ success: true, data: { qrCode } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    if (!url.isActive) {
      return res.status(410).json({ success: false, message: 'This URL has been deactivated' });
    }
    if (url.isExpired()) {
      return res.status(410).json({ success: false, message: 'This URL has expired' });
    }
    url.clicks += 1;
    await url.save();
    const ip = getClientIP(req);
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers.referer || req.headers.referrer || 'direct';
    const location = getLocationFromIP(ip);
    const deviceInfo = parseUserAgent(userAgent);
    await Analytics.create({
      urlId: url._id, ip, userAgent, referrer,
      country: location.country, city: location.city,
      device: deviceInfo.device, browser: deviceInfo.browser, os: deviceInfo.os
    });
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};