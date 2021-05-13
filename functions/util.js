const DDBWrapper = require('ddb-wrapper');
const ddb = new DDBWrapper('us-east-1');

const util = {
  playerTable: process.env.playerTableName,
  gameTable: process.env.gameTableName,
  userTable: process.env.userTableName,
  rendererTable: process.env.rendererTableName,

  ddb: ddb,

  CORSResponse: function (content, status) {
    let contentType = "application/json";
    status = status || 200;
    if (content === null) {
      status = 404;
      content = {};
    }
    if (typeof content !== "string") {
      content = JSON.stringify(content);
    }
    else {
      contentType = "text/plain";
    }
    return {
      statusCode: status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: content,
    }
  },

  simpleGet: async function(table, id) {
    let status = 200;
    let response = "";
    try {
      response = await ddb.get(table, "id", +id);
    } catch(e) {
      response = e;
      status = 500;
    }
    return util.CORSResponse(response, status);
  },

  simpleCreate: async function(table, record) {
    let status = 200;
    let response = "";
    try {
      // Generate a random id for now
      let id = Math.floor(Math.random()*1000000000);
      record.id = id;
      await ddb.put(table, record);
      response = await ddb.get(table, "id", id);
    } catch(e) {
      response = e;
      status = 500;
    }
    return util.CORSResponse(response, status);
  },

  simpleUpdate: async function(table, record, keyAttribute) {
    keyAttribute = keyAttribute || "id";
    let status = 200;
    let response = "";
    try {
      await ddb.update(table, keyAttribute, record);
      response = await ddb.get(table, "id", record.id);
    } catch(e) {
      response = e;
      status = 500;
    }
    return util.CORSResponse(response, status);
  },

  simpleDelete: async function(table, keyValue, keyAttribute) {
    keyAttribute = keyAttribute || "id";
    let status = 200;
    let response = "";
    try {
      response = await ddb.delete(table, keyAttribute, keyValue);
    } catch(e) {
      response = e;
      status = 500;
    }
    return util.CORSResponse(response, status);
  }

};
module.exports = util;
