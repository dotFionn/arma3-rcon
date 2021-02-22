const be = require('battle-node');
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
    this.be = new be(this.ip, this.port, this.password);
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
}

module.exports = Arma3Rcon;
