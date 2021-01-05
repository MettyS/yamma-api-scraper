const { YAMMA_API_ENDPOINT } = require('../config');
const EventService = require('./event-service');

const YammaApiService = {
  async sendEvents(eventRes, category) {
    const events = eventRes.value;
    //console.log('*** the event array is: ', events);

    Promise.all(EventService.processEvents(events, category))
    //.then(res => res.json())
    .then((res) => {
      console.log('this event was successfully added to db:\n', res)
    })
    .catch(er => {
      console.log(er);
    })
  }
}

module.exports = YammaApiService;