const { selectCommentsByArticleId, insertComment } = require("../models/comments.models.js");
const { checkExists } = require("../db/seeds/utils.js");

const getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  checkExists("articles", "article_id", article_id)
    .then(() => {
      return selectCommentsByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  checkExists("articles", "article_id", article_id)
    .then(() => {
      return insertComment(username, body, article_id);
    })
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleComments, postComment };
