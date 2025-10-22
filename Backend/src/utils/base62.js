const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE = CHARSET.length;

function encode(num) {
  if (num === 0) return CHARSET[0];
  
  let encoded = '';
  while (num > 0) {
    encoded = CHARSET[num % BASE] + encoded;
    num = Math.floor(num / BASE);
  }
  return encoded;
}

function decode(str) {
  let decoded = 0;
  for (let i = 0; i < str.length; i++) {
    decoded = decoded * BASE + CHARSET.indexOf(str[i]);
  }
  return decoded;
}

function generateShortCode(length = 6) {
  let shortCode = '';
  for (let i = 0; i < length; i++) {
    shortCode += CHARSET[Math.floor(Math.random() * BASE)];
  }
  return shortCode;
}

function generateUniqueCode() {
  const timestamp = Date.now();
  const encoded = encode(timestamp);
  const random = generateShortCode(2);
  return encoded + random;
}

module.exports = {
  encode,
  decode,
  generateShortCode,
  generateUniqueCode
};