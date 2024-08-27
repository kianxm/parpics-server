require("dotenv").config();

const Client = require("../../models/Client");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    async getClientPhotos(_, { clientId }) {
      const client = await Client.findById(clientId).populate("photos");
      if (!client) {
        throw new Error("Client not found");
      }
      return client.photos;
    },

    async checkAccessCode(_, { accessCode }) {
      const client = await Client.findOne({ accessCode });
      if (!client) {
        return {
          isValid: false,
          link: null,
        };
      }
      return {
        isValid: true,
        link: client.link,
      };
    },

    async getAlbumPage(_, { link }) {
      const client = await Client.findOne({ link });
      if (!client) {
        throw new Error("Client not found");
      }
      return client;
    },

    async getClientSettings(_, { clientId }) {
      const client = await Client.findById(clientId).select("settings").lean();
      if (!client) {
        throw new Error("Client not found");
      }
      return client.settings;
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

    async addPhotoToClient(_, { clientId, photoInput }) {
      const client = await Client.findById(clientId);
      if (!client) {
        throw new Error("Client not found");
      }

      client.photos.push(photoInput);
      client.photoCount = client.photos.length;
      await client.save();

      return client;
    },

    async deletePhoto(_, { publicId }) {
      // Delete photo from Cloudinary
      try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary response:", result);

        if (result.result === "ok") {
          // Remove photo from the database
          const client = await Client.findOne({ "photos.publicId": publicId });

          if (client) {
            // Remove photo from client's photos array
            client.photos = client.photos.filter(
              (photo) => photo.publicId !== publicId
            );
            client.photoCount = client.photos.length; // Update photoCount
            await client.save();
            return true;
          } else {
            throw new Error("Photo not found in database.");
          }
        } else {
          throw new Error(`Photo deletion failed: ${result.result}`);
        }
      } catch (error) {
        console.error("Error deleting photo:", error);
        throw new Error(`Failed to delete photo: ${error.message}`);
      }
    },

    async deleteAllClientPhotos(_, { clientId }) {
      // Find the client
      const client = await Client.findById(clientId);
      if (!client) {
        throw new Error("Client not found");
      }

      try {
        // Delete each photo from Cloudinary
        const photoDeletionPromises = client.photos.map((photo) =>
          cloudinary.uploader.destroy(photo.publicId)
        );

        // Wait for all photo deletions to complete
        const results = await Promise.all(photoDeletionPromises);

        // Check results and handle errors
        results.forEach((result, index) => {
          if (result.result !== "ok") {
            console.error(
              `Failed to delete photo ${client.photos[index].publicId}: ${result.result}`
            );
          }
        });

        client.photos = [];
        client.photoCount = 0;
        await client.save();

        return true;
      } catch (error) {
        console.error("Error deleting photos:", error);
        throw new Error(`Failed to delete all photos: ${error.message}`);
      }
    },

    async toggleFavoritePhoto(_, { clientId, publicId }) {
      const client = await Client.findOne({ _id: clientId });
      if (!client) {
        throw new Error("Client not found");
      }

      const photo = client.photos.find((photo) => photo.publicId === publicId);
      if (!photo) {
        throw new Error("Photo not found");
      }

      photo.isFavorite = !photo.isFavorite;
      await client.save();

      return "Success";
    },

    async addCommentToPhoto(_, { clientId, publicId, commentInput }) {
      const client = await Client.findById(clientId);
      if (!client) {
        throw new Error("Client not found");
      }

      const photo = client.photos.find((photo) => photo.publicId === publicId);
      if (!photo) {
        throw new Error("Photo not found");
      }

      const newComment = {
        author: commentInput.author,
        text: commentInput.text,
        createdAt: new Date().toISOString(),
      };

      photo.comments = photo.comments
        ? [...photo.comments, newComment]
        : [newComment];

      const res = await client.save();

      return {
        id: res._id.toString(),
        photo,
      };
    },

    async deleteComment(_, { clientId, publicId, commentId }) {
      const client = await Client.findById(clientId);
      if (!client) {
        throw new Error("Client not found", "CLIENT_NOT_FOUND");
      }

      const photo = client.photos.find((photo) => photo.publicId === publicId);
      if (!photo) {
        throw new Error("Photo not found", "PHOTO_NOT_FOUND");
      }

      const commentIndex = photo.comments.findIndex(
        (comment) => comment.id === commentId
      );

      if (commentIndex === -1) {
        throw new Error("Comment not found", "COMMENT_NOT_FOUND");
      }

      photo.comments.splice(commentIndex, 1);
      await client.save();

      return "Comment deleted successfully";
    },

    async updateClientWebsiteTemplate(_, { clientId, templateId }) {
      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        { $set: { websiteTemplate: templateId } },
        { new: true }
      );

      if (!updatedClient) {
        throw new Error("Client not found");
      }

      return "Success";
    },

    async updateClientSettings(_, { clientId, settingsInput }) {
      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        { $set: { settings: settingsInput } },
        { new: true }
      );

      if (!updatedClient) {
        throw new Error("Client not found");
      }

      return updatedClient.settings;
    },
  },
};
