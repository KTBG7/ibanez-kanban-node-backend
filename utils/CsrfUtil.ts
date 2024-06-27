const doubleCsrfUtilities = require('csrf-csrf').doubleCsrf({
    getSecret: () => "Secret", // A function that optionally takes the request and returns a secret
    cookieName: "__kanban-psifi.x-csrf-token", // The name of the cookie to be used, recommend using Host prefix.
    cookieOptions: {
        domain: "localhost",
        sameSite : "lax",  // Recommend you make this strict if posible
        path : "/",
        secure : false,
        signed: false
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

module.exports = doubleCsrfUtilities;