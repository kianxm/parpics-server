require("dotenv").config();

const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({ typeDefs, resolvers });
const port = parseInt(process.env.PORT, 10) || 8080;

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("MongoDB connected");
    return server.listen({ port: port });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
