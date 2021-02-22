/*
  → players.js
  → arma3-rcon by dotFionn
*/

module.exports = function () {
  this.getPlayers = function () {
    return new Promise((res, rej) => {
      try {
        if (!this.be) {
          rej('There is currently no Connection to an RCON Server.');
        }

        this.be.sendCommand('players', res);
      } catch (e) {
        rej(e);
      }
    });
  };

};
