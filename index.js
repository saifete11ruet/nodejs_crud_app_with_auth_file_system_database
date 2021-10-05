/*
 * Title: Crud with Authentication
 * Description: Crud with Authentication
 * Author: Saif
 * Date: 09/11/2021
 */

// Dependencies
const http = require("http");

// Modules
const config = require("./config");

// Services
const { RequestResponseService } = require("./Services/RequestResponseService");

// app object - module-scaffolding
const app = {};

// create server
app.createServer = () => {
  const server = http.createServer(RequestResponseService);
  server.listen(config.port, () => {
    console.log(
      `${config.name} Environment - Server running on ${config.port}`
    );
  });
};

// start the server
app.createServer();
