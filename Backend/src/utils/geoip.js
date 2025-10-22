const geoip = require('geoip-lite');

function getLocationFromIP(ip) {
  if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      country: 'Local',
      city: 'Local'
    };
  }

  const geo = geoip.lookup(ip);
  
  if (!geo) {
    return {
      country: 'Unknown',
      city: 'Unknown'
    };
  }

  return {
    country: geo.country || 'Unknown',
    city: geo.city || 'Unknown',
    region: geo.region || '',
    timezone: geo.timezone || ''
  };
}

function parseUserAgent(userAgent) {
  if (!userAgent) {
    return {
      device: 'unknown',
      browser: 'Unknown',
      os: 'Unknown'
    };
  }

  const ua = userAgent.toLowerCase();
  
  let device = 'desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    device = 'tablet';
  } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    device = 'mobile';
  }

  let browser = 'Unknown';
  if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('opera')) browser = 'Opera';

  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'MacOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  return { device, browser, os };
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.ip ||
         '127.0.0.1';
}

module.exports = {
  getLocationFromIP,
  parseUserAgent,
  getClientIP
};