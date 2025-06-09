const db = require("../db/connection.js");

const selectAllArticles = () => {
  const queryStr = `
    SELECT 
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
        ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;   
    `;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

const selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url
       FROM articles
       WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      //   if (!rows.length) {
      //     return Promise.reject({ status: 404, msg: "not found" });
      //   }
      return rows[0];
    });
};

const updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
     SET votes = votes + $1
     WHERE article_id = $2
     RETURNING author, title, article_id, body, topic, created_at, votes, article_img_url;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { selectAllArticles, selectArticleById, updateArticleById };
