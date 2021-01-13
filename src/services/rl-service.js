const TestServiceApi = require('./test-service-api');
const { NODE_ENV } = require('../config');

const RlService = {
  validateStartFields(input) {
    try {
      if (!input) return false;
      if (input === 'error') return false;
      if (typeof parseInt(input) !== 'number' && typeof input !== 'number') {
        console.log(input);
        return false;
      }
    } catch (er) {
      return false;
    }

    return true;
  },
  handleStartStop(input, bingApi, categories) {
    if (input === 'start') {
      if (NODE_ENV === 'dev_test') TestServiceApi.sendTestEvent();
      else {
        bingApi.mount();
      }
      return 1;
    } else if (input === 'stop') {
      bingApi.unMount();
      return 1;
    } else {
      // start (c) (interval=[###]) (time=[###])
      //const regexPattern = /((?<=category=).*?(?=&))/
      //const category = this.queryParams.match(regexPattern);
      const regexPattern = /(?<=start[ ]+).*$/;
      const validInput = regexPattern.test(input);
      //const collectedInput = input.match(regexPattern);
      const inputArray = input.split(/\s+/);

      if (inputArray[0] === 'start' && inputArray[1] === 'c') {
        let interval = 1;
        let time = 1;
        if (inputArray[2]) {
          const intInput = inputArray[2].split('=');
          interval =
            intInput[0] === 'interval' && intInput[1]
              ? parseInt(intInput[1], 10)
              : 'error';
        }

        if (inputArray[3]) {
          const timInput = inputArray[3].split('=');
          time =
            timInput[0] === 'time' && timInput[1]
              ? parseInt(timInput[1], 10)
              : 'error';
        }

        if (
          !this.validateStartFields(interval) ||
          !this.validateStartFields(time)
        ) {
          console.log(`invalid input.. type 'help' for more`);
        } else {
          try {
            //console.log('THIS WOULD MAKE IT MOUNT')
            console.log(
              `mounting with...\ninterval = ${interval} minutes\ntime = ${time} minutes`
            );
            bingApi.mount(interval, time, categories);
          } catch (er) {
            console.log('ERROR: ', er);
            console.log(`invalid input.. type 'help' for more`);
          }
        }
      }
    }
    return 0;
  },
  handleCategory(input, bingApi, categories) {
    if (categories[input]) {
      console.log('updated category!');
      bingApi.setQParams(categories[input]);
      return 1;
    }
    return 0;
  },
  handleHelp(input, categories) {
    if (input === 'help') {
      console.log(
        'possible commands: ',
        `start (c) (interval=[###]) (time=[###]) 
        << NOTE 'interval' and 'time' expect positive integer values to represent time in minutes >>
        stop
        [category]
        help`
      );
      console.log('possible categories: ', Object.keys(categories));
      return 1;
    }
    return 0;
  },
};

module.exports = RlService;
