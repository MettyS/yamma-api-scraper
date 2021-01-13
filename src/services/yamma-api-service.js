const { YAMMA_API_ENDPOINT } = require('../config');
const EventService = require('./event-service');

const YammaApiService = {
  async sendEvents(eventRes, category) {
    if(!eventRes){
      console.log('eventRes is undefined');
      return;
    }

    if(!eventRes.value) {
      console.log('eventRes.value is undefined, the eventRes is');
      console.log(eventRes);
      return;
    }

    if(eventRes.errors){
      console.log('invalid request made to bing');
      console.log(eventRes);
      return;
    }

    eventRes.then( (eventRes) => {
      console.log('sending events: ');
      console.log(eventRes);
    
    const events = eventRes.value;
    const formattedEvents = EventService.processEvents(events, category);
    
    formattedEvents.forEach((req) => {
      if(!req.formatingError)
        this.handlePromise(req);
    });
    })
    .catch(er => {
      console.log(er);
    })

    
  },

  async handlePromise(eventPromise) {

    eventPromise
      .then((res) => res.json())
      .then((res) => {

        if(res.error) {
          console.log('Unsuccessful...');
          console.log(res.error)
        }else
          console.log('Success!');
      
      })
      .catch((er) => {
        console.log('ERROR: ', er);
      });
  },
};

module.exports = YammaApiService;
