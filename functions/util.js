const DDBWrapper = require('ddb-wrapper');
const ddb = new DDBWrapper('us-east-1');

const util = {
  playerTable: process.env.playerTableName,
  gameTable: process.env.gameTableName,
  gameTableIndex: process.env.gameTableIndexName,
  userTable: process.env.userTableName,
  rendererTable: process.env.rendererTableName,

  ddb: ddb,
  randomId: function() {
    return Math.floor(Math.random()*1000000000);
  },
  now: Date.now(),

  CORSError: function(content) {
    return util.CORSResponse({"error":content}, 500);
  },
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

  cleanseRecord: function(submittedRecord, attributes, enforceRequiredFields=true) {
    let record = {};

    // Copy attributes - be strict
    for (let attr in submittedRecord) {
      if (!submittedRecord.hasOwnProperty(attr)) { continue; }
      if (typeof attributes[attr]==="undefined") {
        throw `Attribute ${attr} is not allowed`;
      }
      record[attr] = submittedRecord[attr];
    }

    // Make sure required attributes are included
    if (enforceRequiredFields) {
      for (let attr in attributes) {
        if (attributes[attr]) { //required
          if (!record.hasOwnProperty(attr)) {
            throw `Attribute ${attr} is required but not present`;
          }
        }
      }
    }
    return record;
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

  simpleScan: async function(table, params) {
    let status = 200;
    let response = "";
    try {
      response = await ddb.scan(table, params);
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
      await ddb.putUnique(table, record, "id");
      response = await ddb.get(table, "id", record.id);
    } catch(e) {
      response = e;
      status = 500;
    }
    return util.CORSResponse(response, status);
  },

  simpleReplace: async function(table, record) {
    let status = 200;
    let response = "";
    try {
      // Only allow replace if current record exists
      let current_record = await ddb.get(table, "id", record.id);
      if (!current_record || !current_record.id) {
        throw "Cannot replace record that does not exist";
      }
      record.created_on = current_record.created_on;

      await ddb.put(table, record, "id");

      response = await ddb.get(table, "id", record.id);
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
