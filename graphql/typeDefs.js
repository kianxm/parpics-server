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

  type User {
    email: String
    password: String
    token: String
  }

  input ClientInput {
    name: String
    link: String
    accessCode: Int
    location: String
    date: String
    hasPaid: Boolean
  }

  input RegisterInput {
    email: String
    password: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Query {
    user(id: ID): User!

    getClient(clientId: ID!): Client!
    getClients(amount: Int): [Client]
    getAllClients: [Client]
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User!
    loginUser(loginInput: LoginInput): User!

    createClient(clientInput: ClientInput): Client!
    deleteClient(clientId: ID!): String!
    editClient(clientId: ID!, clientInput: ClientInput): Client!
  }
`;
