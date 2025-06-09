const db = require("../db/connection.js");
const format = require("pg-format");

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id
       FROM comments
       WHERE article_id = $1
       ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      //   if (!rows.length) {
      //     return Promise.reject({ status: 404, msg: "not found" });
      //   }
      return rows;
    });
};

const insertComment = (username, body, article_id) => {
  const queryStr = `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING comment_id, author, body, article_id, votes, created_at;
    `;

  return db.query(queryStr, [username, body, article_id]).then(({ rows }) => {
    return rows[0];
  });
};

module.exports = { selectCommentsByArticleId, insertComment };
