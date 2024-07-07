const doubleCsrfUtilities = require('csrf-csrf').doubleCsrf({
    getSecret: () => "Secret", // A function that optionally takes the request and returns a secret
    cookieName: "__kanban-psifi.x-csrf-token", // The name of the cookie to be used, recommend using Host prefix.
    cookieOptions: {
        sameSite : "strict",  // Recommend you make this strict if posible
        path : "/",
        secure : true,
        signed: true,
    },
    getTokenFromRequest: (req)=>{
        return req.headers["x-csrf-token"]
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

module.exports = doubleCsrfUtilities;