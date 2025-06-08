const express = require("express");
const app = express();
const db = require("./db/connection.js");
const { getEndpoints } = require("./controllers/api.controllers.js");
const { getAllTopics } = require("./controllers/topics.controllers.js");
const { getAllArticles, getArticleById } = require("./controllers/articles.controllers.js");
const { getAllUsers } = require("./controllers/users.controllers.js");
const { handlePostgresErrors, handleCustomErrors, handleServerErrors } = require("./errors.js");
const { getArticleComments } = require("./controllers/comments.controllers.js");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.use(handlePostgresErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
