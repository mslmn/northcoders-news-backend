const { selectAllArticles } = require("../models/articles.models.js");

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

module.exports = { getAllArticles };
