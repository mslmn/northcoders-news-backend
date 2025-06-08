const { selectCommentsByArticleId } = require("../models/comments.models.js");

const getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = { getArticleComments };
