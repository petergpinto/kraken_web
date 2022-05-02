
var speakeasy = require("speakeasy");


var token = speakeasy.totp({
	secret: 'IBRDEJD5IJRUG',
  encoding: 'base32',
})

console.log(token);

var tokenDelta = speakeasy.totp.verify({
  secret: 'IBRDEJD5IJRUG',
  encoding: 'base32',
  token: token,
  window: 2,
});
console.log(tokenDelta)
