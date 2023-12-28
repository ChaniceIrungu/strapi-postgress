module.exports = [
  "strapi::errors",
  "strapi::security",
  // "strapi::cors",
  "strapi::poweredBy",
  {
    name: "strapi::cors",
    config: {
      headers: "*",
      origin: ["*"],
    },
  },
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
