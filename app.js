const express = require("express");
const app = express();
const db = require("./db/connection.js");
const { getEndpoints } = require("./controllers/api.controllers.js");
const { getAllTopics } = require("./controllers/topics.controllers.js");
const { getAllArticles } = require("./controllers/articles.controllers.js");
const { getAllUsers } = require("./controllers/users.controllers.js");
const { handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./errors.js");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.use(handlePostgresErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
