const ws = require('ws');

const client = new ws('ws://localhost:3001');

client.on('open', () => {
  // Causes the server to print "Hello"
  client.send('Hello');
});
