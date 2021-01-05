module.exports = {
  PORT: process.env.PORT || 6000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'yamma-secret', // TODO
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h', // TODO
  NEWS_API_KEY: process.env.NEWS_API_KEY || 'dummy-key', // NOT IN USE
  RAPID_API_KEY: process.env.RAPID_API_KEY || 'haha-wrong-key', // CHECK DISCORD #resources FOR THIS
  RAPID_API_HOST: process.env.RAPID_API_HOST || 'check discord #resources for this',
  YAMMA_API_ENDPOINT: process.env.YAMMA_API_ENDPOINT || 'http://localhost:8000/events',
};
