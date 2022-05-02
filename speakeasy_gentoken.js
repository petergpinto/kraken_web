
var speakeasy = require("speakeasy");

var secret = speakeasy.generateSecret({length: 8});

console.log(secret);
