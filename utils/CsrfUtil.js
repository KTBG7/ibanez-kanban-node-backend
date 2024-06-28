var doubleCsrfUtilities = require('csrf-csrf').doubleCsrf({
    getSecret: function () { return "Secret"; }, // A function that optionally takes the request and returns a secret
    cookieName: "__kanban-psifi.x-csrf-token", // The name of the cookie to be used, recommend using Host prefix.
    cookieOptions: {
        sameSite: "none", // Recommend you make this strict if posible
        path: "/",
        secure: true
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});
module.exports = doubleCsrfUtilities;
