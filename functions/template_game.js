module.exports = {
  create: async function () {
    return {};
  },

  start: async function () {
    state = {

    };

    // Tell the engine to ask the first player to move
    return getNextTurn();
  },

  onTurn: async function (moves) {
    for (const [playerId, move] of Object.entries(moves)) {

    }
    return getNextTurn();
  }

};
