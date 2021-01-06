require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const NewsAPI = require('newsapi');
const TestServiceApi = require('./services/test-service-api');

//const { createProxyMiddleware } = require('http-proxy-middleware');

const { NODE_ENV, NEWS_API_KEY } = require('./config');

// NOT IN USE
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

// *************
//  Bing Router
// *************

// import the route
const BingNewsApi = require('./bing-news-api');
// make new route instance
// -- OPTIONAL PARAMS --
// BOOLEAN 'running' - should the route should mount during instantiation (DEFAULT false),
// INT 'intervalSizeInMin' - how many minutes between fetch to BingNewsApi (DEFAULT 1 min),
// INT 'timeOutSizeInMin' - how many minutes until unmount (DEFAULT 1 min)
const bingRoute = new BingNewsApi();
const usWest =
  'count=100&mkt=en-US&safeSearch=Off&category=US_West&headlineCount=100&';
bingRoute.setQParams(usWest);

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  `Type 'start' to mount the bingapi OR type 'stop' to unmount the bingapi`
);
rl.on('line', (input) => {
  if (input === 'start') {
    if (NODE_ENV === 'dev_test') TestServiceApi.sendTestEvent();
    else bingRoute.mount();
  } else if (input === 'stop') {
    bingRoute.unMount(bingRoute);
  } else {
    console.log(
      `Type 'start' to mount the bingapi OR type 'stop' to unmount the bingapi`
    );
  }
});

rl.on('close', function () {
  console.log(
    '\n-------------------------------------> sending process, bye now!'
  );
  process.exit(0);
});

// EXAMPLE PROXY SETUP << NOT IN USE >>
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

// EXAMPLE NEWS-API USAGE << NOT IN USE >>
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
});
*/

// Sample GET endpoint
app.get('/info', (req, res, next) => {
  res.send('This is the proxy service yamma-proxy');
});

module.exports = app;
