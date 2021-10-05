/**
 * Title: User controllers
 * Description: Handle Request for User routes
 * Author: Saif
 * Date: 09/13/2021
 */

// Dependencies
const data = require("../Services/DatabaseService");

// Modules
const { hash, parseJson } = require("../Services/HelperService");

// Controller Scaffolding
const controller = {};

controller.UserController = (requestProperties, callback) => {
  const allowedMethods = ["post", "get", "put", "delete"];
  if (allowedMethods.indexOf(requestProperties.method) > -1) {
    controller._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// Define user and its functions for different request methods
controller._users = {};

// POST
controller._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;

  const userObject = {
    firstName,
    lastName,
    phone,
    password: hash(password),
    tosAgreement,
  };

  //   console.log(userObject);

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that user already doesn't exist
    data.read("users", phone, (err) => {
      if (err) {
        // If user doesn't exist
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              msg: "User has been created successfully",
            });
          }
        });
      } else {
        callback(500, {
          error: "User already exists",
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
controller._users.get = (requestProperties, callback) => {
  // check for valid phone
  const phone =
    typeof requestProperties.queryObjectString.phone === "string" &&
    requestProperties.queryObjectString.phone.trim().length == 11
      ? requestProperties.queryObjectString.phone
      : false;
  if (phone) {
    data.read("users", phone, (err, userObject) => {
      const user = { ...parseJson(userObject) };
      if (!err && user) {
        delete user.password;
        callback(200, user);
      } else {
        callback(404, {
          error: "Error getting user",
        });
      }
    });
  } else {
    callback(404, {
      error: "User Not Found or Invalid User",
    });
  }
};

// PUT
controller._users.put = (requestProperties, callback) => {
  // check for valid phone
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length == 11
      ? requestProperties.body.phone
      : false;

  if (phone) {
    const firstName =
      typeof requestProperties.body.firstName === "string" &&
      requestProperties.body.firstName.trim().length > 0
        ? requestProperties.body.firstName
        : false;

    const lastName =
      typeof requestProperties.body.lastName === "string" &&
      requestProperties.body.lastName.trim().length > 0
        ? requestProperties.body.lastName
        : false;

    const password =
      typeof requestProperties.body.password === "string" &&
      requestProperties.body.password.trim().length > 0
        ? requestProperties.body.password
        : false;

    if (firstName || lastName || password) {
      data.read("users", phone, (err, userObject) => {
        if (!err && userObject) {
          const user = { ...parseJson(userObject) };
          firstName ? (user.firstName = firstName) : false;
          lastName ? (user.lastName = lastName) : false;
          password ? (user.password = hash(password)) : false;

          // Update data
          data.update("users", phone, user, (err2) => {
            if (!err2) {
              callback(200, {
                msg: "User has been updated successfully",
              });
            } else {
              callback(500, {
                error: "Error updating user",
              });
            }
          });
        } else {
          callback(400, {
            error: "The User doesn't exist",
          });
        }
      });
    }
  } else {
    callback(400, {
      error: "There is a problem in your request",
    });
  }
};

// DELETE
controller._users.delete = (requestProperties, callback) => {
  // check for valid phone
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length == 11
      ? requestProperties.body.phone
      : false;
  if (phone) {
    data.read("users", phone, (err, userObject) => {
      if (!err && userObject) {
        // delete data
        data.delete("users", phone, (err2) => {
          if (!err2) {
            callback(200, {
              msg: "User has been deleted successfully",
            });
          } else {
            callback(500, {
              error: "Error deleting user",
            });
          }
        });
      } else {
        callback(400, {
          error: "User Not Found",
        });
      }
    });
  } else {
    callback(404, {
      error: "User Not Found or Invalid User",
    });
  }
};

module.exports = controller;
