const fs = require('fs');
const fetch = require('node-fetch');

const writeOutput = (res) => {
  fs.appendFile('./output/bing_output.json', res, (err) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('JSON data is saved.');
  });
};

class BingNewsApiRouter {
  constructor(running = false) {
    this.running = running;
    // default query params
    this.queryParams = 'textDecorations=false&count=100&mkt=en-US&';
    this.interval;
    this.minutesPassed = 0;
  }

  mount() {
    console.log(
      'OMGOMGOMGOMGOMGOMGOMGOMG MOUNTING BINGROUTER NOW!!!!!!!!!!!!!!!!!!!!!!'
    );
    this.running = true;
    this.fetchContent();
  }

  unMount() {
    if (!!this.interval) {
      clearInterval(this.interval);
      console.log('unmounted bing, setting running to false');
      this.running = false;
    } else {
      console.log(
        'trying to unmount, but we are not mounted!! running: ',
        this.running
      );
    }
  }

  async fetchContent() {
    /*fetch('https://httpbin.org/post', {
          method: 'post',
          body:    JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
      })
      .then(res => res.json())
      .then(json => console.log(json));*/
    if (!this.running) {
      console.log('mistakenly trying to start fetch... quitting now!');
      return;
    }

    this.interval = setInterval(function () {
      console.log(`${this.minutesPassed} MINUTES HAVE PASSED, FETCHING NOW`);
      this.minutesPassed = this.minutesPassed + 1;

      fetch(
        `https://bing-news-search1.p.rapidapi.com/news?${this.queryParams}safeSearch=Off&textFormat=Raw`,
        {
          method: 'GET',
          headers: {
            'x-bingapis-sdk': 'true',
            'x-rapidapi-key':
              '5da2ae0b98msha23715ba207f2ddp1e59cejsnafe17b1f6602',
            'x-rapidapi-host': 'bing-news-search1.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log('writing output..');
          writeOutput(JSON.stringify(res));

          console.log('GOT THE RESPONSE!!!!!!!!!!!!! : ');
          console.log(res);

          const news = res.value;
          console.log('EXAMPLE IMAGE: ', news[0].image);
          console.log('EXAMPLE PROVIDER ARRAY: ', news[0].provider);
        })
        .catch((er) => {
          console.error(er);
        });
    }, 30000);

    setTimeout(this.unMount, 2 * 60 * 1000);
  }
}

module.exports = BingNewsApiRouter;
