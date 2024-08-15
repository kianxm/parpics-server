const clientResolvers = require("./client");
const userResolvers = require("./user");

module.exports = {
  Query: {
    ...clientResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...clientResolvers.Mutation,
    ...userResolvers.Mutation,
  },
};
