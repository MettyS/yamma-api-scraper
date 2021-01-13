const fetch = require('node-fetch');
const { YAMMA_API_ENDPOINT, YAMMA_AUTH_KEY } = require('../config');

const EventService = {
  processEvents(events, defaultCategory) {
    return events.map((uEvent) => {
      return this.formatFetchEvent(uEvent, defaultCategory);
    });
  },
  formatFetchEvent(uEvent, defaultCategory) {
    try {
      //console.log('the provider array is: ', uEvent.provider);
      //console.log('the event image is: ', uEvent.image);

      const fEvent = {
        title: uEvent.name,
        categories: defaultCategory,
        description: uEvent.description,
        event_img: uEvent.image.thumbnail.contentUrl,
        source_name: uEvent.provider[0].name,
        source_url: uEvent.url,
        source_img: uEvent.provider[0].image
          ? uEvent.provider[0].image.thumbnail.contentUrl
          : 'no image',
        date_published: uEvent.datePublished,
      };

      return fetch(`${YAMMA_API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${YAMMA_AUTH_KEY}`
        },
        body: JSON.stringify({ event: fEvent }),
      });
    } catch (er) {
      console.log('there was an error with this unformatted event: ', uEvent);
      return { formatingError: er };
    }
  },
};

module.exports = EventService;
