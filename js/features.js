const dailyChallenge = {
  getDailySeed: () => {
    const today = new Date().toISOString().slice(0, 10);
    return parseInt(CryptoJS.MD5(today).toString().slice(0, 8), 16);
  },
  // ... challenge logic ...
};