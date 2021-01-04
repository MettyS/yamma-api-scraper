module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'yamma-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
  NEWS_API_KEY: process.env.NEWS_API_KEY || 'dummy-key',
};
