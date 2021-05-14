module.exports = {
  handler: async function(event) {
    const jwt = require("jsonwebtoken");

    function generateAuthResponse(principalId, effect, methodArn) {
      let policyDocument = generatePolicyDocument(effect, methodArn);
      return {
        principalId: principalId,
        policyDocument: policyDocument
      };
    }

    function generatePolicyDocument(effect, methodArn) {
      if (!effect || !methodArn) return null;
      const policyDocument = {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: methodArn
          }
        ]
      };
      return policyDocument;
    }

    const methodArn = event.methodArn;
    let token = event.headers.Authorization.replace("Bearer ", "");
    const cert = process.env.CERT;
    const userObj = jwt.verify(token, cert, { algorithms: ['RS256'] });

    try {
      if (!token) { return "Unauthorized - no token"; }
      if (!methodArn) { return "Unauthorized - no methodArn"; }

      let id = "X";
      if (userObj && userObj.id) {
        id = userObj.id;
        return generateAuthResponse(id, "Allow", methodArn);
      } else {
        return generateAuthResponse(id, "Deny", methodArn);
      }
    }
    catch (e) {
      return generateAuthResponse(id, "Deny", methodArn);
    }

  },

  test: async function(event) {
    try {
      const jwt = require("jsonwebtoken");
      let token = event.headers.Authorization.replace("Bearer ", "");
      const cert = process.env.CERT;

      const userObj = jwt.verify(token, cert, { algorithms: ['RS256'] });

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(userObj)
      }
    }
    catch (e) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(e)
      }
    }
  }
};
