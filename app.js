const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const app = express();
const port = process.env.PORT || 8080;
const MONGODB_URI =
  'mongodb+srv://v25798979D:SjNV2JvCEynwUCAQ@cluster0.e7urz.mongodb.net/messages?retryWrites=true&w=majority';
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(bodyParser.json());
app.use(
  multer({
    storage: fileStorage,
    fileFilter,
  }).single('image'),
);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-methods',
    'GET, POST, PUT, DELETE, PATCH',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use((error, _req, res, _next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});
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
