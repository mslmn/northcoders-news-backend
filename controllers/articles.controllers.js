const { selectAllArticles, selectArticleById } = require("../models/articles.models.js");

const getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
module.exports = { getAllArticles, getArticleById };
