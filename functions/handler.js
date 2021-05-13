"use strict";
const {Worker} = require('worker_threads');

function WorkerPlayer(code) {

  // Inject Adapter code into the player
  // Receive a message, call the player method, and postMessage the result
  code = `
  module={};
  const {parentPort} = require('worker_threads');
  parentPort.on('message',function(m) { 
    if (typeof module.exports[m.method]==="function") { 
      parentPort.postMessage(module.exports[m.method](m.argument||null));
    }
    else {
      parentPort.postMessage(null);
    }
  });
` + code;

  // Create a Worker from the modified source
  let worker = new Worker(code,{eval:true});

  // Only one active Promise at a time. Outside the callWorker so onmessage can resolve it
  let workerResolve = null;
  worker.on('message', function(m) {
    workerResolve(m);
  });

  // Util method to call a method on the worker code
  let callWorker = async function(method,argument) {
    return new Promise((resolve)=>{
      workerResolve = resolve;
      worker.postMessage({"method":method, "argument":argument});
    });
  };

  // Create an Adapter Player to pass to the engine
  let playerAdapter = {
    "onTurn": async function(turnRequest) {
      return await callWorker("onTurn",turnRequest);
    },
    onGameStart: async function (PlayerGameStart) {
      return await callWorker("onGameStart", PlayerGameStart);
    },
    onGameEnd: async function (PlayerGameEnd) {
      return await callWorker("onGameEnd", PlayerGameEnd);
    },

    __terminate: async()=>{
      await worker.terminate();
    }
  };

  return playerAdapter;
}


module.exports = {

  match: async (event) => {
    let p1, p2;
    try {
      const DDBWrapper = require('ddb-wrapper');
      const ddb = new DDBWrapper('us-east-1');

      const battlescripts = require('./index.js');
      //const game = require('./tic-tac-toe.js');

      let logs=[];
      let json = JSON.parse(event.body);

      // Do a test insert to dynamo
      await ddb.put(playerTable, {"id":Date.now(), "code":json.p1});

      let game = eval(json.game);

      p1 = WorkerPlayer(json.p1);
      p2 = WorkerPlayer(json.p2);
      let games = json.games || 4;

      // Watch the game as it is being played
      let previousState = null;
      battlescripts.observe(function(gameDirective) {
        // Allow the game to log things
        let log = gameDirective.log;
        if (log) {
          if (typeof log==="string") { log = [log]; }
          log.forEach(s=>{
            logs.push(`Game Log: ${s}`)
          });
        }

        // Log the game to the console to watch
//        console.log( render(gameDirective.state,previousState) );
        previousState = gameDirective.state;

        // introduce an artificial delay
        return new Promise((resolve)=>{
          setTimeout(resolve,1);
        });
      });

      // Run a match
      let results = await battlescripts.match({
        game: game,
        players: [p1, p2],
        games: games,
        knowledge: [],
        scenario: {},
        turnTimeout: 100
      });

      let tally = battlescripts.tally(results.results);

      let response = {
        "results": tally,
        "logs": logs,
        "state": results.state
      };

      await p1.__terminate();
      await p2.__terminate();

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(response),
      };

    } catch(e) {
      if (p1 && p1.__terminate) {
        await p1.__terminate();
      }
      if (p2 && p2.__terminate) {
        await p2.__terminate();
      }

      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(e),
      };
    }

  },

};

// // Local testing
// (async()=>{
//   let event = {body:`{"p1":"// Stupid Player #1\\n// Take the first available move from top down\\nmodule.exports = {\\n onTurn: function (turnRequest) {\\n let gameState = turnRequest.gameState;\\n for (let row=0; row<3; row++) {\\n for (let col=0; col<3; col++) {\\n if (gameState.board[row][col]===null) {\\n return [row,col];\\n }\\n }\\n }\\n }\\n};\\n ","p2":"// Stupid Player #2\\n// Move randomly\\nmodule.exports = {\\n onTurn: function (turnRequest) {\\n let gameState = turnRequest.gameState;\\n let square, row, col;\\n do {\\n row = Math.floor(Math.random() * 3);\\n col = Math.floor(Math.random() * 3);\\n square = gameState.board[row][col];\\n } while(square!==null);\\n return [row,col];\\n }\\n};\\n ","games":"1"}`};
//   let results = (await module.exports.match(event)).body;
//   let j = JSON.parse(results);
//   console.log( JSON.stringify(j,null,2) );
// })();
