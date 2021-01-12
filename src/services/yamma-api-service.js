const { YAMMA_API_ENDPOINT } = require('../config');
const EventService = require('./event-service');

const YammaApiService = {
  async sendEvents(eventRes, category) {
    if(eventRes.errors){
      console.log('invalid request made to bing');
      console.log(eventRes);
      return;
    }

    
    const events = eventRes.value;
    const formattedEvents = EventService.processEvents(events, category);
    
    formattedEvents.forEach((req) => {
      if(!req.error)
        this.handlePromise(req);
    });
  },

  async handlePromise(eventPromise) {
    eventPromise
      .then((res) => res.json())
      .then((res) => {
        //console.log('no error');
      })
      .catch((er) => {
        console.log('ERROR: ', er);
      });
  },
};

module.exports = YammaApiService;
