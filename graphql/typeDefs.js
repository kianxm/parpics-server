const { gql } = require("apollo-server");

module.exports = gql`
  type Client {
    name: String
    link: String
    accessCode: Int
    location: String
    date: String
    hasPaid: Boolean
    createdAt: String
    updatedAt: String
    photoCount: Int
  }

  input ClientInput {
    name: String
    link: String
    accessCode: Int
    location: String
    date: String
    hasPaid: Boolean
  }

  type Query {
    getClient(clientId: ID!): Client!
    getClients(amount: Int): [Client]
    getAllClients: [Client]
  }

  type Mutation {
    createClient(clientInput: ClientInput): Client!
    deleteClient(clientId: ID!): String!
    editClient(clientId: ID!, clientInput: ClientInput): Client!
  }
`;
