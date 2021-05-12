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

  simpleGet: function(table, id) {
    return async function(event) {
      let status = 200;
      let response = "";
      try {
        let id = event.pathParameters.id;
        response = await ddb.get(table, "id", +id);
      } catch(e) {
        response = e;
        status = 500;
      }
      return util.CORSResponse(response, status);
    }
  }

};
module.exports = util;
