const { YAMMA_API_ENDPOINT } = require('../config');
const EventService = require('./event-service');

const YammaApiService = {
  async sendEvents(eventRes, category) {
    const events = eventRes.value;

    EventService.processEvents(events, category).forEach((req) => {
      this.handlePromise(req);
    });
  },

  async handlePromise(eventPromise) {
    eventPromise
      .then((res) => res.json())
      .then((res) => {
        console.log('no error: ', res);
      })
      .catch((er) => {
        console.log('ERROR: ', er);
      });
  },
};

module.exports = YammaApiService;
