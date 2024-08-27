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
    websiteTemplate: Int
    userId: ID
    photos: [Photo]
  }

  type User {
    name: String
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
    name: String
    username: String
    email: String
    password: String
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
    isFavorite: Boolean
    comments: [Comment]
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
    isFavorite: Boolean
  }

  type Viewer {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  input ViewerInput {
    name: String!
    email: String!
    password: String
  }

  type Comment {
    id: ID!
    author: String!
    text: String!
    createdAt: String!
  }

  input CommentInput {
    author: String!
    text: String!
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
    getUserById(userId: ID!): User!
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
    registerViewer(registerInput: RegisterInput): User!
    loginUser(loginInput: LoginInput): User!

    createClient(clientInput: ClientInput, userId: ID!): Client!
    deleteClient(clientId: ID!): String!
    editClient(clientId: ID!, clientInput: ClientInput): Client!

    addPhotoToClient(clientId: ID!, photoInput: PhotoInput!): Client!
    toggleFavoritePhoto(clientId: ID!, publicId: String!): String!

    addCommentToPhoto(
      clientId: ID!
      publicId: String!
      commentInput: CommentInput!
    ): Photo!
    deleteComment(clientId: ID!, publicId: String!, commentId: ID!): String!

    deletePhoto(publicId: String!): Boolean
    deleteAllClientPhotos(clientId: ID!): Boolean

    updateClientWebsiteTemplate(clientId: ID!, templateId: Int!): String!
  }
`;
