const { gql } = require("apollo-server");

module.exports = gql`
  type Client {
    id: ID!
    name: String
    link: String
    accessCode: String
    location: String
    date: String
    hasPaid: Boolean
    createdAt: String
    updatedAt: String
    photoCount: Int
    userId: ID
  }

  type User {
    email: String
    password: String
    token: String
  }

  input ClientInput {
    name: String
    link: String
    accessCode: String
    location: String
    date: String
    hasPaid: Boolean
  }

  input RegisterInput {
    email: String
    password: String
    confirmPassword: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Query {
    user(id: ID): User!

    getClient(clientId: ID!): Client
    getClients(amount: Int): [Client]
    getAllClients: [Client]
    getAllClientsByUserId(userId: ID!): [Client]
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User!
    loginUser(loginInput: LoginInput): User!

    createClient(clientInput: ClientInput, userId: ID!): Client!
    deleteClient(clientId: ID!): String!
    editClient(clientId: ID!, clientInput: ClientInput): Client!
  }
`;
