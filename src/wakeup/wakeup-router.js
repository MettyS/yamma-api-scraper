const express = require('express');
const WakeupService = require('./wakeup-service');
const wakeupRouter = express.Router();

wakeupRouter.route('/').get((req, res, next) => {
  try {
    WakeupService.handleWakeup(req.bingApi);
    res.status(200).json({ message: 'woke up!' });
  } catch (er) {
    console.log('ERROR WHILE TRYING TO WAKEUP');
    console.log(er);
    next(er);
  }
});

module.exports = wakeupRouter;
