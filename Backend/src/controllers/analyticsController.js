const Analytics = require('../models/Analytics');
const Url = require('../models/Url');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');

exports.getUrlAnalytics = async (req, res) => {
  try {
    const { urlId } = req.params;
    const { days = 30 } = req.query;
    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    if (url.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view analytics for this URL' });
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const analytics = await Analytics.find({ urlId, timestamp: { $gte: startDate } }).sort({ timestamp: -1 });
    const totalClicks = analytics.length;
    const clicksByDate = {};
    analytics.forEach(entry => {
      const date = entry.timestamp.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });
    const countryCount = {};
    analytics.forEach(entry => {
      countryCount[entry.country] = (countryCount[entry.country] || 0) + 1;
    });
    const topCountries = Object.entries(countryCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([country, count]) => ({ country, count }));
    const referrerCount = {};
    analytics.forEach(entry => {
      referrerCount[entry.referrer] = (referrerCount[entry.referrer] || 0) + 1;
    });
    const topReferrers = Object.entries(referrerCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([referrer, count]) => ({ referrer, count }));
    const deviceCount = {};
    analytics.forEach(entry => {
      deviceCount[entry.device] = (deviceCount[entry.device] || 0) + 1;
    });
    const browserCount = {};
    analytics.forEach(entry => {
      browserCount[entry.browser] = (browserCount[entry.browser] || 0) + 1;
    });
    const osCount = {};
    analytics.forEach(entry => {
      osCount[entry.os] = (osCount[entry.os] || 0) + 1;
    });
    res.status(200).json({
      success: true,
      data: {
        url: { id: url._id, originalUrl: url.originalUrl, shortCode: url.shortCode, totalClicks: url.clicks },
        analytics: {
          totalClicks, clicksByDate, topCountries, topReferrers, devices: deviceCount, browsers: browserCount, operatingSystems: osCount,
          recentClicks: analytics.slice(0, 20).map(entry => ({
            timestamp: entry.timestamp, country: entry.country, city: entry.city, referrer: entry.referrer, device: entry.device, browser: entry.browser
          }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportAnalytics = async (req, res) => {
  try {
    const { urlId } = req.params;
    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }
    if (url.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to export analytics for this URL' });
    }
    const analytics = await Analytics.find({ urlId }).sort({ timestamp: -1 });
    if (analytics.length === 0) {
      return res.status(404).json({ success: false, message: 'No analytics data found for this URL' });
    }
    const csvData = analytics.map(entry => ({
      timestamp: entry.timestamp.toISOString(), country: entry.country, city: entry.city, referrer: entry.referrer,
      device: entry.device, browser: entry.browser, os: entry.os, ip: entry.ip
    }));
    const fileName = `analytics-${url.shortCode}-${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../../temp', fileName);
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'timestamp', title: 'Timestamp' }, { id: 'country', title: 'Country' }, { id: 'city', title: 'City' },
        { id: 'referrer', title: 'Referrer' }, { id: 'device', title: 'Device' }, { id: 'browser', title: 'Browser' },
        { id: 'os', title: 'Operating System' }, { id: 'ip', title: 'IP Address' }
      ]
    });
    await csvWriter.writeRecords(csvData);
    res.download(filePath, fileName, (err) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id });
    const urlIds = urls.map(url => url._id);
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAnalytics = await Analytics.find({ urlId: { $in: urlIds }, timestamp: { $gte: thirtyDaysAgo } });
    const clicksLast30Days = recentAnalytics.length;
    const topUrls = urls.sort((a, b) => b.clicks - a.clicks).slice(0, 5).map(url => ({
      id: url._id, originalUrl: url.originalUrl, shortCode: url.shortCode, clicks: url.clicks, createdAt: url.createdAt
    }));
    const clicksByDate = {};
    recentAnalytics.forEach(entry => {
      const date = entry.timestamp.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });
    res.status(200).json({
      success: true,
      data: { totalUrls, totalClicks, clicksLast30Days, topUrls, clicksByDate }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};