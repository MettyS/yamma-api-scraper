require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const NewsAPI = require('newsapi');

//const { createProxyMiddleware } = require('http-proxy-middleware');

const { NODE_ENV, NEWS_API_KEY } = require('./config');

const newsapi = new NewsAPI(`${NEWS_API_KEY}`);

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(
  morgan(morganOption, {
    skip: () => NODE_ENV === 'test',
  })
);

app.use(cors());
app.use(helmet());
app.use(express.static('public'));

const BingNewsApiRouter = require('./bing-news-api-router');
const bingRouter = new BingNewsApiRouter();
console.log('JUST MADE A ROUTER, GOING TO MOUNT IT NOW');
bingRouter.mount();

//const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";

//app.use('/auth', authRouter);

//app.use(errorHandler);
// Proxy endpoints
/*
app.use('/json_placeholder', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/json_placeholder`]: '',
  },
}));
*/

// https://newsapi.org/v2/sources?language=en&country=us&apiKey=0198a68f3fa44a738254b4cdceee5066

// https://newsapi.org/v2/top-headlines?country=us&apiKey=0198a68f3fa44a738254b4cdceee5066

/*
newsapi.v2.topHeadlines({
  language: 'en',
  country: 'us',
  pageSize: 100
}).then(response => {
  console.log('got our thing! >>>>>>>>>> ')
  console.log(response);
  
    // {
    //   status: "ok",
    //   articles: [...]
    // }
  
});
*/

console.log(
  '----------------------------------------------> is this line reached?'
);

// Info GET endpoint
app.get('/info', (req, res, next) => {
  res.send('This is the proxy service yamma-proxy');
});

module.exports = app;
