/*
  → app.js
  → arma3-rcon by dotFionn
*/

const be = require('battle-node');

be.prototype.close = function (cb = () => {}) {
  this.connected = false;
  clearInterval(this.keepalive);
  this.socket.unref();
  this.socket.close();
  cb();
};

function Arma3Rcon(ip, port, password) {
  this.ip = ip;
  this.port = port;
  this.password = password;

  this.connectCallback = () => {};

  this.connect = function () {
    return new Promise((res, rej) => {
      this.be = new be({ ip: this.ip, port: this.port, rconPassword: this.password });

      this.be.on('login', (err, success) => {
        if (err) {
          return rej(err);
        }

        res(success);
      });

      this.be.login();
    });
  }.bind(this);

  this.close = function () {
    return new Promise((res, rej) => {
      try {
        if (this.be) {
          this.be.close(res);
        }
        this.be = undefined;
      } catch (e) {
        rej(e);
      }
    });
  }.bind(this);

  this.getPlayers = function () {
    return new Promise((res, rej) => {
      this.rconCommand('players').then(res).catch(rej);
    });
  };

  this.getPlayersArray = function () {
    return new Promise((res, rej) => {
      this.getPlayers().then((data) => {
        let dataArray = [
          ...data.matchAll(/(\d+)\s+(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d+\b)\s+(\d+)\s+([0-9a-fA-F]+)\(\w+\)\s([\S ]+)$/gim),
        ].map((e) => e.splice(1, e.length - 1));
        dataArray.map((e) => {
          let name = e[5];
          if (name.includes(' (Lobby)')) {
            e[5] = name.replace(' (Lobby)', '');
            e[6] = true;
          } else {
            e[6] = false;
          }
        });

        res(dataArray);
      });
    });
  };

  this.getPlayerCount = function () {
    return new Promise((res, rej) => {
      this.getPlayers()
        .then((data) => {
          res(data.split('\n').pop().match(/(\d+)/gim)[0]);
        })
        .catch(rej);
    });
  };

  this.say = function (message, player = -1) {
    return new Promise((res, rej) => {
      this.rconCommand(`say ${player} ${message}`).then(res).catch(rej);
    });
  };

  this.rconCommand = function (command) {
    return new Promise((res, rej) => {
      try {
        if (!this.be) {
          rej('There is currently no Connection to an RCON Server.');
        }

        this.be.sendCommand(command, res);
      } catch (e) {
        rej(e);
      }
    });
  };
}

module.exports = Arma3Rcon;
