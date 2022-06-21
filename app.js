const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const app = express();
const port = process.env.PORT || 8080;
const MONGODB_URI =
  'mongodb+srv://v25798979D:SjNV2JvCEynwUCAQ@cluster0.e7urz.mongodb.net/messages?retryWrites=true&w=majority';
// app.use(bodyParser.urlencoded)
app.use(bodyParser.json());
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/feed', feedRoutes);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(port, () =>
      console.log(`listening on http://localhost:${port}`),
    );
  })
  .catch(err => {
    console.log(err);
  });
