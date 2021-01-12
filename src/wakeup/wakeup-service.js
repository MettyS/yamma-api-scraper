const WakeupService = {
  handleWakeup(bingApi) {
    bingApi.mount();
    bingApi.incrementCategory();
  },
};

module.exports = WakeupService;
