const fetch = require('node-fetch');
const { YAMMA_API_ENDPOINT } = require('../config');

const EventService = {
  processEvents(events, defaultCategory) {
    return [this.formatFetchEvent(events[0], defaultCategory)];
    // let formattedEvents = events.map(uEvent => {
    //   return (
    //     this.formatFetchEvent(uEvent, defaultCategory)
    //   );
    // })
  },
  formatFetchEvent(uEvent, defaultCategory) {
    const fEvent = {
      title: uEvent.name,
      categories: defaultCategory,
      description: uEvent.description,
      event_img: uEvent.image.thumbnail.contentUrl,
      source_name: uEvent.provider[0].name,
      source_url: uEvent.url,
      source_img: uEvent.provider[0].image.thumbnail.contentUrl,
      date_published: uEvent.datePublished
    }

    console.log('FORMATTED EVENT: ', fEvent);
    console.log('Strigified&Formated Event: ', JSON.stringify(fEvent))

    return fetch(`${YAMMA_API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ event: fEvent })
      
    })
  },
  
}


module.exports = EventService;