const util = require('./util.js');

module.exports = {
  get: async function(event) {
    let id = +event.pathParameters.id;
    return await util.simpleGet(util.rendererTable, id)
  },

  create: async function(event) {
    let record = JSON.parse(event.body);
    return await util.simpleCreate(util.rendererTable, record);
  },

  update: async function(event) {
    let record = JSON.parse(event.body);
    record.id = +event.pathParameters.id;
    return await util.simpleUpdate(util.rendererTable, record);
  },

  'delete': async function(event) {
    let id = +event.pathParameters.id;
    return await util.simpleDelete(util.rendererTable, id);

  }
};
