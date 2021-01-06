const fetch = require('node-fetch');
const { YAMMA_API_ENDPOINT } = require('../config');

const TestServiceApi = {
  async sendTestEvent() {
    Promise.all([this.testFetchFormattedEvent()])
      .then((res) => res[0].json())
      .then((res) => {
        console.log('this event was successfully added to db:\n', res);
      })
      .catch((er) => {
        console.log('THERE WAS ERROR OMG NOOOOOOOO: ', er);
      });
  },

  testFetchFormattedEvent() {
    const fEvent = {
      title:
        'Palm Springs police exposed to coronavirus after man spits on them ',
      categories: 'US_West',
      description:
        'The man, who later tested positive for the coronavirus, spat at police officers who responded to a call about someone throwing things at vehicles.',
      event_img:
        'https://www.bing.com/th?id=OVFT.44Wm5At9XmrPgjJAuMMlSC&pid=News',
      source_name: 'The LA Times on MSN.com',
      source_url:
        'https://www.msn.com/en-us/news/crime/palm-springs-police-exposed-to-coronavirus-after-man-spits-on-them/ar-BB1cuYsu',
      source_img:
        'https://www.bing.com/th?id=AR_f6ee0777fa236afab60d094d1018c0b6',
      date_published: '2021-01-05T18:59:00.0000000Z',
    };

    return fetch(`${YAMMA_API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ event: fEvent }),
    });
  },
};

module.exports = TestServiceApi;
