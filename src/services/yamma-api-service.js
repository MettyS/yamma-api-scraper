const { response } = require('../app');
const { YAMMA_API_ENDPOINT } = require('../config');
const EventService = require('./event-service');

const YammaApiService = {
  async sendEvents(eventRes, category) {
    const events = eventRes.value;
    //console.log('*** the event array is: ', events);

    EventService.processEvents(events, category).forEach((req) => {
      this.handlePromise(req);
    });
    /*Promise.all(EventService.processEvents(events, category))
    .then(res => res.map(resObj => resObj.json()))
    .then((res) => {
      console.log('this event was successfully added to db:\n', res)
    })
    .catch(er => {
      console.log(er);
    })*/
  },

  async handlePromise(eventPromise) {
    eventPromise
      .then((res) => {
        if (!res.ok) return Promise(this.handleReject(res));

        return res.json();
      })
      .then((res) => {
        console.log('no issue!', res);
      })
      .catch((er) => {
        console.log('ERROR: ', er);
      });
  },
  handleReject(rejectedRes) {
    console.log('handle reject sees --> ', rejectedRes);
    rejectedRes
      .then((res) => res.json())
      .then((res) => {
        console.log('handle reject gets --> ', res);
        if (!res.error.message) {
          return { '**************** unhandled rejection: ': res };
        } else if (
          res.error.message === 'attempted to insert duplicate'
        ) {
          if (
            res.oldEvent.categories.includes(
              res.badEvent.categories
            )
          ) {
            return { '* handled rejection *': res.error.message };
          } else {
            console.log(
              'here we will do a helper to call the put end point to add in the untracked category'
            );
          }
        } else {
          return { 'MYSTERIOUS ******* unhandled rejection: ': responseJson };
        }
      })
      .catch(er => {
        console.log(er);
      })
  },
};

module.exports = YammaApiService;
