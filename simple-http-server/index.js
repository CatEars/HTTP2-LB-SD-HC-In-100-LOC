const http = require('http');
const crypto = require('crypto');

const request = require('request');
const express = require('express');

const port = 8000;
const ID = Math.floor(Math.random().toString() * 10000).toString();
const healthID = crypto.createHash('md5').update(ID).digest('hex');

const data = {
  Name: "httpserver",
  ID: healthID,
  Tags: ["urlprefix-/getid"],
  Address: process.env.MY_ADDRESS,
  Port: port,
  Check: {
    HTTP: `http://${process.env.MY_ADDRESS}:${port}`,
    ID: healthID,
    Name: "httpserver check",
    Interval: "5s",

  }
};

request.put({
  uri: 'http://consul:8500/v1/agent/service/register',
  method: 'PUT',
  json: true,
  body: data
}, (err, response, body) => {
  if (err) console.error('ERROR:', err);
  if (response) console.log('CODE:', response.statusCode);
  if (body) console.log('BODY:', body);
});

const app = express();
app.get('/*', (req, res) => {
  res.send(`My ID is: ${ID}\n`);
});
app.listen(port, () => console.log(`Listening on port ${port}`));
