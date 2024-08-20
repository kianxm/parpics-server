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
    photos: [Photo]
  }

  type User {
    username: String
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
    username: String
    email: String
    password: String
    confirmPassword: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Photo {
    name: String
    createdAt: String
    format: String
    bytes: Int
    url: String
    publicId: String
    version: Int
    assetId: String
  }

  input PhotoInput {
    name: String
    createdAt: String
    format: String
    bytes: Int
    url: String
    publicId: String
    version: Int
    assetId: String
  }

  type DashboardOverview {
    totalClients: Int
    totalPhotos: Int
    totalPaidClients: Int
  }

  type CheckAccessCodeResponse {
    isValid: Boolean!
    link: String
  }

  type Query {
    user(id: ID): User!
    getUserByUsername(username: String!): User!
    checkAccessCode(accessCode: Int!): CheckAccessCodeResponse

    getClient(clientId: ID!): Client
    getClients(amount: Int): [Client]
    getAllClients: [Client]
    getAllClientsByUserId(userId: ID!): [Client]

    getClientPhotos(clientId: ID!): [Photo]
    getAlbumPage(link: String!): Client!

    getDashboardOverview(userId: ID!): DashboardOverview!
  }

  type Mutation {
    registerUser(registerInput: RegisterInput): User!
    loginUser(loginInput: LoginInput): User!

    createClient(clientInput: ClientInput, userId: ID!): Client!
    deleteClient(clientId: ID!): String!
    editClient(clientId: ID!, clientInput: ClientInput): Client!

    addPhotoToClient(clientId: ID!, photoInput: PhotoInput!): Client!
    toggleFavoritePhoto(publicId: String!): Photo

    deletePhoto(publicId: String!): Boolean
    deleteAllClientPhotos(clientId: ID!): Boolean
  }
`;
