const Client = require("../../models/Client");

module.exports = {
  Query: {
    async getDashboardOverview(_, { userId }) {
      const totalClients = await Client.countDocuments({ userId });
      const totalPaidClients = await Client.countDocuments({
        userId,
        hasPaid: true,
      });

      //TODO: Update this to get the total number of photos
      const totalPhotos = 2;

      return {
        totalClients,
        totalPhotos,
        totalPaidClients,
      };
    },
  },
  Mutation: {},
};
