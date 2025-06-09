const { selectAllArticles, selectArticleById } = require("../models/articles.models.js");
const { checkExists } = require("../db/seeds/utils");

const getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  checkExists("articles", "article_id", article_id)
    .then(() => {
      return selectArticleById(article_id);
    })
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getAllArticles, getArticleById };
