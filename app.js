const be = require('node-be');

function Arma3Rcon(ip, port, password) {
  this.ip = ip;
  this.port = port;
  this.password = password;

  this.connect = function () {
    this.be = new be(this.ip, this.port, this.password);
    this.be.connect();
  }.bind(this);

  this.close = function () {
    if (this.be) {
      this.be.close();
    }
    this.be = undefined;
  }.bind(this);
}

module.exports = Arma3Rcon;
