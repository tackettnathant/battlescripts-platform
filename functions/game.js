const util = require('./util.js');

// Game attributes and whether they are required
const attributes = {
  name: true,
  description: false,
  documentation: false,
  reference: false,
  author: false,
  author_name: false,
  code: true,
  player_template:false,
  default_renderer: false,
  published: false,
  version: false
};

module.exports = {
  get: async function(event) {
    let id = +event.pathParameters.id;
    return await util.simpleGet(util.gameTable, id);
  },

  template: async function() {
    let response = {
      id: null,
      name: "",
      description: "",
      documentation: "",
      author: "",
      author_name: "",
      player_template: "",
      default_renderer: null,
      published: false,
      version: ""
    };
    // This should probably be pulled from a file or something?
    response.code =
`module.exports = {
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

};`;
    return util.CORSResponse(response, 200);
  },

  search: async function() {
    return await util.simpleScan(util.gameTable, {
      ProjectionExpression: "#id, #name",
      ExpressionAttributeNames: {
        "#id":"id",
        "#name":"name"
      }
    });
  },

  create: async function(event) {
    let record = {}, submittedRecord;

    // Get the record from the request body
    try {
      submittedRecord = JSON.parse(event.body);
    }
    catch (e) {
      return util.CORSError(`Error parsing JSON: ${e}`);
    }

    try {
      record = util.cleanseRecord(submittedRecord, attributes);
    }
    catch (e) {
      return util.CORSError(e);
    }

    // Generate a new random id
    record.id = util.randomId();

    // Populate audit fields
    record.created_on = util.now;
    record.updated_on = util.now;

    // Do the create and return the new record
    return await util.simpleCreate(util.gameTable, record);
  },

  update: async function(event) {
    let record = {}, submittedRecord;

    // Get the record from the request body
    try {
      submittedRecord = JSON.parse(event.body);
    }
    catch (e) {
      return util.CORSError(`Error parsing JSON: ${e}`);
    }

    try {
      record = util.cleanseRecord(submittedRecord, attributes, false);
    }
    catch (e) {
      return util.CORSError(e);
    }

    // Get the record id from the path
    record.id = +event.pathParameters.id;

    // Populate audit fields
    record.updated_on = util.now;

    return await util.simpleUpdate(util.gameTable, record);
  },

  replace: async function(event) {
    let record = {}, submittedRecord;

    // Get the record from the request body
    try {
      submittedRecord = JSON.parse(event.body);
    }
    catch (e) {
      return util.CORSError(`Error parsing JSON: ${e}`);
    }

    try {
      record = util.cleanseRecord(submittedRecord, attributes);
    }
    catch (e) {
      return util.CORSError(e);
    }

    // Get the record id from the path
    record.id = +event.pathParameters.id;

    // Populate audit fields
    record.updated_on = util.now;

    return await util.simpleReplace(util.gameTable, record);
  },

  'delete': async function(event) {
    let id = +event.pathParameters.id;
    return await util.simpleDelete(util.gameTable, id);

  }
};
