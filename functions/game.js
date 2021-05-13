const util = require('./util.js');

module.exports = {
  get: async function(event) {
    let id = +event.pathParameters.id;
    return await util.simpleGet(util.gameTable, id)
  },

  create: async function(event) {
    let record = JSON.parse(event.body);
    return await util.simpleCreate(util.gameTable, record);
  },

  update: async function(event) {
    let record = JSON.parse(event.body);
    record.id = +event.pathParameters.id;
    return await util.simpleUpdate(util.gameTable, record);
  },

  'delete': async function(event) {
    let id = +event.pathParameters.id;
    return await util.simpleDelete(util.gameTable, id);

  }
};
