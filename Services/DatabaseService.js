/*
 * Title: Database Service
 * Description: Service for Database data ( create, read, update, delete )
 * Author: Saif
 * Date: 09/11/2021
 */

// Dependencies
const fs = require("fs");
const path = require("path");

// Service Scaffolding
const service = {};

service.baseDir = path.join(__dirname, "/../.data");

// Create operation (write data into file)
service.create = (dir, file, data, callback) => {
  // Open file for writing
  fs.open(`${service.baseDir}/${dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to json
      const stringData = JSON.stringify(data);

      // write data to file and close
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback("Error closing the new File");
            }
          });
        } else {
          callback("Can't write into the new file");
        }
      });
    } else {
      callback("Could not open new file. it may already exists");
    }
  });
};

// Read Operation
service.read = (dir, file, callback) => {
  fs.readFile(`${service.baseDir}/${dir}/${file}.json`, "utf8", (err, data) => {
    callback(err, data);
  });
};

// Update Operation
service.update = (dir, file, data, callback) => {
  fs.open(`${service.baseDir}/${dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.ftruncate(fileDescriptor, (err2) => {
        if (!err2) {
          const stringData = JSON.stringify(data);
          fs.writeFile(fileDescriptor, stringData, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback("Error writing data");
            }
          });
        } else {
          callback("Error Truncating the file");
        }
      });
    } else {
      callback("Error opening the file");
    }
  });
};

// Delete Operation
service.delete = (dir, file, callback) => {
  fs.unlink(`${service.baseDir}/${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting file");
    }
  });
};

module.exports = service;
