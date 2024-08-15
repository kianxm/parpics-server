const Client = require("../models/Client");

module.exports = {
  Query: {
    async getClient(_, { ID }) {
      return await Client.findById(ID);
    },
    async getClients(_, { amount }) {
      return await Client.find().sort({ createdAt: -1 }).limit(amount);
    },
    async getAllClients() {
      return await Client.find().sort({ createdAt: -1 });
    },
  },
  Mutation: {
    async createClient(
      _,
      { clientInput: { name, location, hasPaid, link, accessCode, date } }
    ) {
      const createdClient = new Client({
        name: name,
        location: location,
        hasPaid: hasPaid,
        link: link,
        accessCode: accessCode,
        date: date,
      });

      const res = await createdClient.save();

      return {
        id: res.id,
        ...res._doc,
      };
    },
    async deleteClient(_, { ID }) {
      await Client.deleteOne(ID);
      return "Client deleted";
    },
    async editClient(
      _,
      { ID, clientInput: { name, location, hasPaid, link, accessCode, date } }
    ) {
      const updatedClient = await Client.updateOne(
        { _id: ID },
        { name, location, hasPaid, link, accessCode, date }
      );
      return updatedClient;
    },
  },
};
