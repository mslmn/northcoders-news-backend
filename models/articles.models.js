const db = require("../db/connection.js");

const VALID_SORT_COLS = [
  "article_id",
  "title",
  "topic",
  "author",
  "created_at",
  "votes",
  "article_img_url",
  "comment_count",
];

const selectAllArticles = (sort_by = "created_at", order = "desc", topic) => {
  const col = sort_by || "created_at";
  const dir = (order || "desc").toLowerCase();

  if (!VALID_SORT_COLS.includes(col)) {
    return Promise.reject({ status: 400, msg: "invalid sort_by query" });
  }
  if (!["asc", "desc"].includes(dir)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  const values = [];
  let whereClause = "";
  if (topic) {
    values.push(topic);
    whereClause = `WHERE articles.topic = $${values.length}`;
  }

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
    ${whereClause}
    GROUP BY articles.article_id
    ORDER BY ${col} ${dir.toUpperCase()};
  `;

  return db.query(queryStr, values).then(({ rows }) => {
    return rows;
  });
};

const selectArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.body,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments
        ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
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
