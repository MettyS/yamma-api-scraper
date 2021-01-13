const fs = require('fs');
const fetch = require('node-fetch');
const { RAPID_API_KEY, RAPID_API_HOST } = require('./config');
const YammaApiService = require('./services/yamma-api-service');

// helper function to write data to file so we can see data format
const writeOutput = (res) => {
  let time = new Date();
  const timeString =
    `${time.getDate()}_${time.getMonth() + 1}_${time.getFullYear()}` +
    `@${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  fs.appendFile(`./output/bing_output_${timeString}.json`, res, (err) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('JSON data is saved.');
  });
};

// NOTE: setInterval(), clearInterval(), and setTimeout() are all
// async functions that DON'T BELONG TO THIS CLASS.
// this means they can run without a class instance despite being called within class methods
// SO, for them to have access to instance-specific variables like 'this.queryParams'...
// we pass 'this' as a 3rd parameter in a respective call and it is
// passed to the anonymous function as 'router'

class BingNewsApi {
  constructor(mode = 'commandline', running = false) {
    this.mode = mode;
    this.running = running;
    this.category;
    this.queryParams;
    this.setCategory('US');

    if (mode === 'commandline') {
      console.log('BingApi created in mode ---> ', mode);
      this.interval;
    } else if (mode === 'wakeup') {
      console.log('BingApi created in mode ---> ', mode);
      this.categories = {
        us: 'US',
        usWest: 'US_West', //'&category=US_West',
        usNortheast: 'US_Northeast', //'&category=US_Northeast',
        usSouth: 'US_South', //'&category=US_South',
        usMidwest: 'US_Midwest', //'&category=US_Midwest',
        business: 'Business', //'&category=Business',
        politics: 'Politics', //'&category=Politics',
        technology: 'Technology', //'&category=Technology',
        science: 'Science', //'&category=Science',
        health: 'Health', //'&category=Health'
      };

      this.categoryIndex = 0;
    } else {
      throw new Error(
        `Invalid BingApi startup mode: ${mode} . \nValid options: wakeup , commandline`
      );
    }

    // if class instance constructed with running, mount the instance
    if (this.running) this.mount();
  }

  //update queryparameter string
  setQParams(category) {
    this.queryParams = `&category=${category}`;
  }

  setCategory(category) {
    this.setQParams(category);
    this.category = category;
  }

  // Mount the instance
  mount(intervalMult, timeOutMult, categories = null) {
    if (this.running) {
      console.log('already running');
      return;
    }

    this.running = true;
    if (categories && typeof categories === 'object') {
      console.log('-----> Mounting BingRouter Continuously <-----');
      const categoriesArray = Object.values(categories);
      this.mountContinuous(intervalMult, timeOutMult, categoriesArray);
      return;
    } else if (intervalMult || timeOutMult || categories) {
      console.log('Mount Refused : Invalid input for a continuous mount');
    } else {
      console.log('-----> Mounting BingRouter Once <-----');
      this.mountOnce();
    }
  }

  // runs for 10 seconds, gets one fetch at the end of 10 seconds
  mountOnce() {
    // if not running, then not properly mounted. exit function
    if (!this.running) {
      console.log('mistakenly trying to start fetch... quitting now!');
      return;
    }
    this.fetchContent(this);
    this.running = false;
  }

  // ***********************
  //  Wakeup-mode Exclusive
  // ***********************

  incrementCategory() {
    const categoryKeys = Object.keys(this.categories);
    this.categoryIndex =
      this.categoryIndex + 1 < categoryKeys.length ? this.categoryIndex + 1 : 0;

    const currentCategory = this.categories[categoryKeys[this.categoryIndex]];
    console.log('CURRENT CATEGORY IS NOW: ', currentCategory);
    this.setCategory(currentCategory);
  }

  // **************************
  // Commandline-mode Exclusive
  // **************************

  incrementIndex(router, max) {
    if (router.index)
      router.index = router.index + 1 >= max ? 0 : router.index + 1;
    else console.log('tried to increment but you dont have an index!');
  }

  mountContinuous(intervalMult, timeOutMult, categories) {
    if (!this.running) {
      console.log('mistakenly trying to start fetch... quitting now!');
      return;
    }

    this.index = 0;
    this.interval = setInterval(
      (router, categories) => {
        router.category = categories[router.index];
        router.incrementIndex(router, categories.length);
        router.fetchContent(router);
      },
      intervalMult * 60000,
      this,
      categories
    );

    setTimeout(
      (router) => {
        router.unMountRouter(router);
      },
      timeOutMult * 60000,
      this
    );
  }

  unMount() {
    this.unMountRouter(this);
  }

  // Unmount the instance
  unMountRouter(router) {
    // if the router has an interval loop, clear it and stop running
    if (!!router.interval) {
      clearInterval(router.interval);
      console.log('unmounted bing, setting running to false');
      router.running = false;
    }
    // if there is no interval loop, this call was a mistake
    else {
      console.log(
        'trying to unmount, but we are not mounted!! running: ',
        router.running
      );
    }
  }

  async fetchContent(router) {
    fetch(
      `https://bing-news-search1.p.rapidapi.com/news?count=1&mkt=en-US&safeSearch=Off&${router.queryParams}&headlineCount=100&textFormat=Raw`,
      {
        method: 'GET',
        headers: {
          'x-bingapis-sdk': 'true',
          'x-rapidapi-key': `${RAPID_API_KEY}`,
          'x-rapidapi-host': `${RAPID_API_HOST}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => {
        // convert res to json
        return res.json();
      })
      .then((res) => {
        // call helper to store the response
        // console.log('writing output..');
        // writeOutput(JSON.stringify(res));

        console.log('passing bing res to yammaapiservice...');
        YammaApiService.sendEvents(res, router.category);
      })
      .catch((er) => {
        console.error(er);
      });
  }
}

module.exports = BingNewsApi;
