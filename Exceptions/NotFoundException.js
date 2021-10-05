/**
 * Title: Not Found Exception
 * Description: 404 Not Found Exception
 * Author: Saif
 * Date: 09/13/2021
 */

// module scaffolding
const exception = {};

exception.NotFoundException = (requestProperties, callback) => {
  callback(404, {
    error: "404 Not Found",
  });
};

module.exports = exception;
