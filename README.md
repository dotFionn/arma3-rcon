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
- reading bans unparsed and parsed
- auto reconnecting
- say/messages to clients

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

When using the library like described in the example above, it will automatically try to reconnect to the server **24 times** with an interval of **5 seconds** between each attempt.
This Behavior can be influenced by passing an object as 4th parameter to the constructor:

```js
const a3r = new A3Rcon('xxx.xxx.xxx.xxx', 1234, 'password', {
  // set to false to disable auto reconnect
  enabled: true,

  // set the time between reconnection attempts in seconds
  interval: 5,

  // set the amount of tries that are carried out before quitting the connection
  count: 24,
});
```

All of these parameters can also be altered after initially constructing the connection:

```js
a3r.autoReconnect = true;
a3r.autoReconnectInterval = 5;
a3r.autoReconnectCount = 24;
```

### IDs

When targeting players that are currently connected to the server, the ID provided to the respective functions has to be the id that is available from the `getPlayers`/`getPlayersArray` functions.

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

### say

`say` sends the `say` command to the server. It accepts 2 parameters: `message` and `player`. If `player` is omitted, it defaults to `-1` which sends the message to every player.

To target the correct player, the ID has to be the ID that is available from the `getPlayers`/`getPlayersArray` functions.

```js
// will send the message to everyone
await a3r.say('hello everyone. please ignore, this is a test :)');

// will send the message to the player with the id 1
await a3r.say('hello. please ignore, this is a test :)', 1);
```

### getBans

`getBans` is really only sending the `bans` command to the server and returns the result without any further processing.

```js
await a3r.getBans();
/*
GUID Bans:
[#] [GUID] [Minutes left] [Reason]
----------------------------------------
0  beguid perm sgsdg

IP Bans:
[#] [IP Address] [Minutes left] [Reason]
----------------------------------------------
1  xxx.xxx.xxx.xxx     1432 tesagsdg
*/
```

### getBansArray

`getBansArray` returns the processed result of `getBans`. Every Player line contains 5 entries: `type`, `id`, `banned resource`, `minutes left/"perm"`, `reason`

```js
await a3r.getBansArray();
/* returns array of arrays
[
  [
    'guid', // type (guid/ip)
    '0', // id
    'beguid', // banned resource
    'perm', // minutes left/"perm"
    'sgsdg' // reason
  ],
  [
    'ip', // type (guid/ip)
    '1', // id
    'xxx.xxx.xxx.xxx', // banned resource
    '1432', // minutes left/"perm"
    'tesagsdg' // reason
  ]
]
*/
```

## Dependencies

We only depend on `battle-node`, which in turn only has one further dependency, which has no further dependencies.

## Version Log

### v1.1.0 - 2021-04-13

- getting bans
- say
- reconnecting

### v1.0.0 - 2021-02-22

- getting player data
- passthrough

## License

The MIT License (MIT)

Copyright (c)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
