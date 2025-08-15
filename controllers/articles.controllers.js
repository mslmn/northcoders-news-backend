const {
  selectAllArticles,
  selectArticleById,
  updateArticleById,
} = require("../models/articles.models.js");

const { checkExists } = require("../db/seeds/utils");

const getAllArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  selectAllArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
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
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (inc_votes === undefined) {
    return next({ status: 400, msg: "missing required field: inc_votes" });
  }

  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "invalid inc_votes value" });
  }

  checkExists("articles", "article_id", article_id)
    .then(() => {
      return updateArticleById(article_id, inc_votes);
    })
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllArticles, getArticleById, patchArticleById };
