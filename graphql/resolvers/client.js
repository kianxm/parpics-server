const Client = require("../../models/Client");

module.exports = {
  Query: {
    async getClient(_, { clientId }) {
      return await Client.findById(clientId);
    },
    async getClients(_, { amount }) {
      return await Client.find().sort({ createdAt: -1 }).limit(amount);
    },
    async getAllClients() {
      return await Client.find().sort({ createdAt: -1 });
    },
    async getAllClientsByUserId(_, { userId }) {
      const clients = await Client.find({ userId }).sort({ createdAt: -1 });
      return clients.map((client) => ({
        id: client._id.toString(),
        ...client._doc,
      }));
    },
  },
  Mutation: {
    async createClient(
      _,
      {
        clientInput: { name, location, hasPaid, link, accessCode, date },
        userId,
      }
    ) {
      const createdClient = new Client({
        name: name,
        location: location,
        hasPaid: hasPaid,
        link: link,
        accessCode: accessCode,
        date: date,
        userId: userId,
        photoCount: 0,
      });

      const res = await createdClient.save();

      return {
        id: res._id.toString(),
        ...res._doc,
      };
    },
    async deleteClient(_, { clientId }) {
      const result = await Client.deleteOne({ _id: clientId });
      if (result.deletedCount === 0) {
        throw new Error("Client not found");
      }
      return "Client deleted";
    },
    async editClient(
      _,
      {
        clientId,
        clientInput: { name, location, hasPaid, link, accessCode, date },
      }
    ) {
      const updatedClient = await Client.updateOne(
        { _id: clientId },
        { name, location, hasPaid, link, accessCode, date }
      );
      return updatedClient;
    },
  },
};
