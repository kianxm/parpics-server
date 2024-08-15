const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const MONGO_DB =
  "mongodb+srv://root:25yqEeWkDV1cyECA@parpics-db.1ctkv.mongodb.net/?retryWrites=true&w=majority&appName=parpics-db";

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({ typeDefs, resolvers });

mongoose
  .connect(MONGO_DB)
  .then(() => {
    console.log("MongoDB connected");
    return server.listen({ port: 5001 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
