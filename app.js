const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const app = express();
const port = process.env.PORT || 8080;

// app.use(bodyParser.urlencoded)
app.use(bodyParser.json());
app.use('/feed', feedRoutes);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
