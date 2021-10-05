/**
 * Title: Token Handlers
 * Description: Handle Request for Token routes
 * Author: Saif
 * Date: 09/13/2021
 */

// Dependencies
const data = require("../Services/DatabaseService");

// Modules
const { hash, parseJson, generateToken } = require("../Services/HelperService");

// Controller Scaffolding
const controller = {};

controller.TokenController = (requestProperties, callback) => {
  const allowedMethods = ["post", "get", "put", "delete"];
  if (allowedMethods.indexOf(requestProperties.method) > -1) {
    controller._tokens[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// Define token and its functions for different request methods
controller._tokens = {};

// POST
controller._tokens.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length == 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    // make sure that phone and password is correct
    data.read("users", phone, (err, user) => {
      if (!err && user) {
        const userObject = { ...parseJson(user) };
        // Check if password matched
        if (hash(password) === userObject.password) {
          const token = generateToken();
          const tokenObject = {
            phone,
            token: token.tokenId,
            expiresAt: token.expiresAt,
          };
          // make sure that token already doesn't exist
          data.read("tokens", token.tokenId, (err2) => {
            if (err2) {
              // If token doesn't exist
              data.create("tokens", token.tokenId, tokenObject, (err3) => {
                if (!err3) {
                  callback(200, tokenObject);
                } else {
                  callback(500, {
                    error: "Error creating new token",
                  });
                }
              });
            } else {
              // recursion until generate unique token
              controller._tokens.post(requestProperties, callback);
            }
          });
        } else {
          callback(403, {
            error: "Invalid Phone or Password",
          });
        }
      } else {
        callback(400, {
          error: "User doesn't exist",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

// GET
controller._tokens.get = (requestProperties, callback) => {
  // check for valid token
  const token =
    typeof requestProperties.headersObject.token === "string" &&
    requestProperties.headersObject.token.trim().length > 0
      ? requestProperties.headersObject.token
      : false;

  if (token) {
    data.read("tokens", token, (err, tokenData) => {
      const tokenObject = { ...parseJson(tokenData) };
      if (!err && tokenData) {
        callback(200, tokenObject);
      } else {
        callback(404, {
          error: "Error getting token",
        });
      }
    });
  } else {
    callback(404, {
      error: "Token is invalid",
    });
  }
};

// PUT
controller._tokens.put = (requestProperties, callback) => {
  // check for valid token
  const token =
    typeof requestProperties.headersObject.token === "string" &&
    requestProperties.headersObject.token.trim().length > 0
      ? requestProperties.headersObject.token
      : false;

  if (token) {
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        tokenDataObject = { ...parseJson(tokenData) };
        // delete token
        data.delete("tokens", token, (err2) => {
          if (!err2) {
            const tokenGenerator = generateToken();
            const tokenObject = {
              phone: tokenDataObject.phone,
              token: tokenGenerator.tokenId,
              expiresAt: tokenGenerator.expiresAt,
            };
            // make sure that token already doesn't exist
            data.read("tokens", tokenGenerator.tokenId, (err3) => {
              if (err3) {
                // If token doesn't exist
                data.create(
                  "tokens",
                  tokenGenerator.tokenId,
                  tokenObject,
                  (err4) => {
                    if (!err4) {
                      callback(200, tokenObject);
                    } else {
                      callback(500, {
                        error: "Error creating new token",
                      });
                    }
                  }
                );
              } else {
                // recursion until generate unique token
                controller._tokens.put(requestProperties, callback);
              }
            });
          } else {
            callback(500, {
              error: "Error deleting token",
            });
          }
        });
      } else {
        callback(400, {
          error: "Token doesn't exist",
        });
      }
    });
  }
};

// DELETE
controller._tokens.delete = (requestProperties, callback) => {
  // check for valid token
  const token =
    typeof requestProperties.headersObject.token === "string" &&
    requestProperties.headersObject.token.trim().length > 0
      ? requestProperties.headersObject.token
      : false;
  if (token) {
    data.read("tokens", token, (err, tokenObject) => {
      if (!err && tokenObject) {
        // delete data
        data.delete("tokens", token, (err2) => {
          if (!err2) {
            callback(200, {
              msg: "Token has been deleted successfully",
            });
          } else {
            callback(500, {
              error: "Error deleting token",
            });
          }
        });
      } else {
        callback(400, {
          error: "Token Not Found",
        });
      }
    });
  } else {
    callback(404, {
      error: "Token Not Found",
    });
  }
};

module.exports = controller;
