const QRCode = require('qrcode');

async function generateQRCode(url) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}

async function generateQRCodeBuffer(url) {
  try {
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 300
    });
    return qrCodeBuffer;
  } catch (error) {
    throw new Error('Failed to generate QR code buffer');
  }
}

module.exports = {
  generateQRCode,
  generateQRCodeBuffer
};