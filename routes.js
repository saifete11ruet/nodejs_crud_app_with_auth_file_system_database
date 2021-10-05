/**
 * Title: Routes
 * Description: Application Routes
 * Author: Saif
 * Date: 09/13/2021
 */

// Controllers
const { UserController } = require("./Controllers/UserController");
const { TokenController } = require("./Controllers/TokenController");

const routes = {
  user: UserController,
  token: TokenController,
};

module.exports = routes;
