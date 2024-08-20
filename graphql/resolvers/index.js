const clientResolvers = require("./client");
const userResolvers = require("./user");
const dashboardResolvers = require("./dashboard");

module.exports = {
  Query: {
    ...clientResolvers.Query,
    ...userResolvers.Query,
    ...dashboardResolvers.Query,
  },
  Mutation: {
    ...clientResolvers.Mutation,
    ...userResolvers.Mutation,
    ...dashboardResolvers.Mutation,
  },
};
