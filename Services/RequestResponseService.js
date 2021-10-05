/**
 * Title: Request Response Service
 * Description: Service for Handling Request Response
 * Author: Saif
 * Date: 09/13/2021
 */

// Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");

// Modules
const routes = require("../routes");

// Exceptions
const { NotFoundException } = require("../Exceptions/NotFoundException");

// Services
const { parseJson } = require("./HelperService");

// Service Scaffolding
const service = {};

service.RequestResponseService = (req, res) => {
  // request handling
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryObjectString = parsedUrl.query;
  const headersObject = req.headers;

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryObjectString,
    headersObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const controller = routes[trimmedPath]
    ? routes[trimmedPath]
    : NotFoundException;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();
    requestProperties.body = parseJson(realData);
    // console.log(parseJson(realData));
    controller(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 5000;
      payload = typeof payload === "object" ? payload : {};
      const payloadString = JSON.stringify(payload);
      // console.log(payloadString);
      // return final response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = service;
