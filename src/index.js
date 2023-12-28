"use strict";
const { default: axios } = require("axios");

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
        origin: [`${process.env.PROD_FRONT_URL}`, "*"], // Allowed origins
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        // credentials: true,
      },
    });

    io.on("connection", function (socket) {
      //Listening for a connection from the frontend
      socket.on("join", async ({ username }) => {
        // Listening for a join connection
        console.log("user connected");
        console.log("username is ", username);
        if (username) {
          socket.join("group"); // Adding the user to the group
          socket.emit("welcome", {
            // Sending a welcome message to the User
            user: "Bot",
            text: `${username}, Welcome to the group chat`,
            userData: username,
          });

          let strapiData = {
            data: {
              users: username,
            },
          };

          await axios
            .post(`${process.env.PROD_SERVER_URL}/active-users`, strapiData)
            .then(async (e) => {
              socket.emit("roomData", { done: "true" });
            })
            .catch((e) => {
              if (e.message == "Request failed with status code 400") {
                //Checking if user exists
                socket.emit("roomData", { done: "existing" });
              }
            });
        } else {
          console.log("An error occurred");
        }
      });

      socket.on("sendMessage", async (data) => {
        // Listening for a sendMessage connection
        console.log("data,data", data);
        let strapiData = {
          // Generating the message data to be stored in Strapi
          data: {
            user: data.user,
            message: data.message,
          },
        };

        // console.log("strapi data", strapiData);
        await axios
          .post(`${process.env.PROD_SERVER_URL}/messages`, strapiData) //Storing the messages in Strapi
          .then((e) => {
            socket.broadcast.to("group").emit("message", data);
          })
          .catch((e) => console.log("error", e.message));
      });
    });
  },
};
