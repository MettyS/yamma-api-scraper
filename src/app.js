require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./services/error-handler');

const RlService = require('./services/rl-service');

const wakeupRouter = require('./wakeup/wakeup-router');
const BingNewsApi = require('./bing-news-api');

const { NODE_ENV, START_UP_MODE } = require('./config');

// NOT IN USE
// const NewsAPI = require('newsapi');
// const newsapi = new NewsAPI(`${NEWS_API_KEY}`);

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

const bingApi = new BingNewsApi(START_UP_MODE);


// *************
//  CommandLine
// *************

if(START_UP_MODE === 'commandline') {

  // -- OPTIONAL PARAMS --
  // BOOLEAN 'running' - should the route should mount during instantiation (DEFAULT false),
  // INT 'intervalSizeInMin' - how many minutes between fetch to BingNewsApi (DEFAULT 1 min),
  // INT 'timeOutSizeInMin' - how many minutes until unmount (DEFAULT 1 min)

  const categories = {
    usWest: 'US_West',//'&category=US_West',
    usNortheast: 'US_Northeast',//'&category=US_Northeast',
    usSouth: 'US_South',//'&category=US_South',
    usMidwest: 'US_Midwest',//'&category=US_Midwest',
    business: 'Business',//'&category=Business',
    politics: 'Politics',//'&category=Politics',
    technology: 'Technology',//'&category=Technology',
    science: 'Science',//'&category=Science',
    health: 'Health',//'&category=Health'
  }

  bingApi.setQParams(categories.usWest);

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  console.log(
    `Type 'start' to mount the bingapi OR type 'stop' to unmount the bingapi`
  );
  rl.on('line', (input) => {

    if(!(RlService.handleStartStop(input, bingApi, categories))
      && !(RlService.handleCategory(input, bingApi, categories))
      && !(RlService.handleHelp(input, categories))){
      console.log(
        `Type 'start' to mount the bingapi OR type 'stop' to unmount the bingapi\nfor more info type 'help'`
      );
    }
  });

  rl.on('close', function () {
    console.log(
      '\n-------------------------------------> sending process, bye now!'
    );
    process.exit(0);
  });
}
// *********
//  Wake Up
// *********
else if(START_UP_MODE === 'wakeup'){

  app.use(
    '/wakeup',
    function (req, res, next) {
      req.bingApi = bingApi;
      next();
    },
    wakeupRouter
  );
}



// Sample GET endpoint
app.get('/', (req, res, next) => {
  res.send('This is the api-scraper service for yamma-api-scraper');
});


app.use(errorHandler);

module.exports = app;
