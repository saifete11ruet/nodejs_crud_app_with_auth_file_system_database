/**
 * Title: Config
 * Description: All configurations of App
 * Author: Saif
 * Date: 09/13/2021
 */

// Module Scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  name: "staging",
  secretKey: "safsdafsadfsdafsadfsda",
};

environments.production = {
  port: 5000,
  name: "production",
  secretKey: "dfafeettetetetetet",
};

// Determine which environment is passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
