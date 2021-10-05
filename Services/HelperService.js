/*
 * Title: Helper Service
 * Description: Service for Helper Function
 * Author: Saif
 * Date: 09/27/2021
 */

// Dependencies
const crypto = require("crypto");

// Modules
const { secretKey } = require("../config");

// Service Scaffolding
const service = {};

// Error handling with json parse
service.parseJson = (body) => {
  try {
    return JSON.parse(body);
  } catch (error) {
    return {};
  }
};

// Hashing password
service.hash = (password) => {
  return typeof password === "string" && password.length > 0
    ? crypto.createHmac("sha256", secretKey).update(password).digest("hex")
    : false;
};

// Generate Token
service.generateToken = () => {
  const currentTime = Date.now();
  const availableChars = "abcdefghijklmnopqrst123456789";
  let randomString = "";
  for (i = 0; i < 20; i++) {
    randomString += availableChars.charAt(
      Math.floor(Math.random() * availableChars.length)
    );
  }
  const tokenId = `${currentTime}${randomString}`;
  const expiresAt = currentTime + 1000 * 60 * 60 * 24;
  return {
    tokenId,
    expiresAt,
  };
};

module.exports = service;
