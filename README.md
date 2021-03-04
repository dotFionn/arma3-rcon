# arma3-rcon

`arma3-rcon` is a npm module, designed to make interacting with your arma 3 server as easy as possible.

## Installation

Installation is done using the default `npm install` command:

```sh
npm install arma3-rcon
```

## Current Features

- pass-through for RCON commands
- getting player data in 3 forms:
  - unparsed/default BattlEye output
  - only the player count
  - player data array

## Usage

All our functions are designed to be asynchronous, so that they can be used with `.then` or `async`/`await`.

### Basic Usage

```js
const A3Rcon = require('arma3-rcon');

// ip-adress, port, password
const a3r = new A3Rcon('xxx.xxx.xxx.xxx', 1234, 'password');

a3r.connect().then(async (success) => {
  // success is true when logging in worked, false if not
  // connection is ready, so it can be used
});
```

### rconCommand

`rconCommand` is the pass-through function to directly interact with the server and use functionality, that might not be implemented yet. It returns the raw response from the RCON server, without any processing done. Further documentation on BattlEye's RCON is available at [https://www.battleye.com/support/documentation/](https://www.battleye.com/support/documentation/).

```js
await a3r.rconCommand('players');
/*
Players on server:
[#] [IP Address]:[Port] [Ping] [GUID] [Name]
--------------------------------------------------
1   ip:port     port   beguid(OK) name (Lobby)
0   ip:port     port   beguid(OK) name
(2 players in total)
*/
```

### getPlayers

`getPlayers` is really only sending the `players` command to the server and returns the result without any further processing.

```js
await a3r.getPlayers();
/*
Players on server:
[#] [IP Address]:[Port] [Ping] [GUID] [Name]
--------------------------------------------------
1   ip:port     port   beguid(OK) name (Lobby)
0   ip:port     port   beguid(OK) name
(2 players in total)
*/
```

### getPlayersArray

`getPlayersArray` returns the processed result of `getPlayers`. Every Player line contains 7 entries: `id`, `ip`, `port`, `ping`, `beguid`, `name`, `lobby`

```js
await a3r.getPlayersArray();
/* returns array of arrays
[
  [
    '1',
    'xxx.xxx.xxx.xxx', // ip
    'xxxx', // port
    '63', // ping
    'beguid', // BattlEye GUID
    'name', // Arma 3 Profile Name
    true // is user in lobby
  ],
  [
    '0',
    'xxx.xxx.xxx.xxx', // ip
    'xxxx', // port
    '79', // ping
    'beguid', // BattlEye GUID
    'name', // Arma 3 Profile Name
    false // is user in lobby
  ]
]
*/
```

### getPlayerCount

`getPlayerCount` returns the number of all players currently on the server. It uses a regex on the last line of the `getPlayers` response, to minimize resource usage opposing to counting the elements in the `getPlayersArray`.

```js
await a3r.getPlayerCount();
/*
2
*/
```

## Dependencies

We only depend on `battle-node`, which in turn only has one further dependency, which has no further dependencies.

## License

The MIT License (MIT)

Copyright (c)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
