"use strict";

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    var io = require("socket.io")(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:1337",

        methods: ["GET", "POST"],

        // allowedHeaders: ["my-custom-header"],

        // credentials: true,
      },
    });

    io.on("connection", (socket) => {
      let header = {
        Accept: "application/json",

        // Authorization: `Bearer ${socket.handshake.auth.token}`
      };

      console.log("User connected");

      socket.on("join", ({ roomId }) => {
        console.log("roomId >> ", roomId);

        // if (roomId) {

        console.log(`room id ${roomId} connected`);

        socket.join(roomId);

        // }

        socket.on("sendMessage", async (message) => {
          console.log(message);
        });
      });
    });
  },
};
