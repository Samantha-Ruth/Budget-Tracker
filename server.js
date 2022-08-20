const express = require('express');
const path = require('path');
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget-tracker";

app.use(express.json());
// Added path below:
app.use(express.static(path.join(__dirname, 'public')))
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// routes
app.use(require("./routes/api.js"));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

// Use this to log mongo queries being executed!
mongoose.set('debug', true);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});