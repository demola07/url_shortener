'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.DB_URI);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const links = [];
let id = 0;

// your first API endpoint...
app.post('/api/shorturl/new', function (req, res) {
  const { url } = req.body;

  const noHTTPSUrl = url.replace(/^https?:\/\//, '');

  dns.lookup(noHTTPSUrl, (err) => {
    if (err) {
      return res.json({ error: 'invalid URL' });
    } else {
      id++;
      const newLink = {
        original_url: url,
        short_url: `${id}`,
      };

      links.push(newLink);
      return res.json(newLink);
    }
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const { id } = req.params;
  const shortURL = links.find((link) => link.short_url === id);

  if (shortURL) {
    return res.redirect(shortURL.original_url);
  } else {
    return res.json({ error: 'No short url' });
  }
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
