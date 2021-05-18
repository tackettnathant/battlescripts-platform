const util = require('./util.js');

module.exports = {
  get: async function(event) {
    let id = +event.pathParameters.id;
    return await util.simpleGet(util.playerTable, id)
  },

  create: async function(event) {
    let record = JSON.parse(event.body);

    // Generate a random id for now
    let id = Math.floor(Math.random()*1000000000);
    record.id = id;

    return await util.simpleCreate(util.playerTable, record);
  },

  update: async function(event) {
    let record = JSON.parse(event.body);
    record.id = +event.pathParameters.id;
    return await util.simpleUpdate(util.playerTable, record);
  },

  'delete': async function(event) {
    let id = +event.pathParameters.id;
    return await util.simpleDelete(util.playerTable, id);

  }
};
