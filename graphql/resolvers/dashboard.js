const Client = require("../../models/Client");

module.exports = {
  Query: {
    async getDashboardOverview(_, { userId }) {
      const totalClients = await Client.countDocuments({ userId });
      const totalPaidClients = await Client.countDocuments({
        userId,
        hasPaid: true,
      });

      const clients = await Client.find({ userId }).select("photos");
      let totalPhotos = 0;
      let storageUsed = 0;

      clients.forEach((client) => {
        if (client.photos && client.photos.length > 0) {
          totalPhotos += client.photos.length;
          storageUsed += client.photos.reduce(
            (sum, photo) => sum + photo.bytes,
            0
          );
        }
      });

      return {
        totalClients,
        totalPhotos,
        totalPaidClients,
        storageUsed,
        storageRemaining: 2147483648 - storageUsed,
      };
    },
  },
  Mutation: {},
};
