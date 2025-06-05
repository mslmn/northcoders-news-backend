const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate } = require("./utils");
const { createLookupObj } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE TOPICS (
          slug VARCHAR PRIMARY KEY,
          description VARCHAR NOT NULL,
          img_url VARCHAR(1000) NOT NULL
          );
          `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR PRIMARY KEY,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR(1000) NOT NULL
          );
        `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          topic VARCHAR REFERENCES topics(slug) ON DELETE CASCADE,
          author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000) NOT NULL
         );
        `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
          body TEXT NOT NULL,
          votes INT DEFAULT 0,
          author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
        `);
    })
    .then(() => {
      const formattedTopics = topicData.map(({ description, slug, img_url }) => {
        return [description, slug, img_url];
      });

      const topicString = format(
        `INSERT INTO topics (description, slug, img_url) VALUES %L RETURNING *;`,
        formattedTopics
      );

      return db.query(topicString);
    })
    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => {
        return [username, name, avatar_url];
      });

      const userString = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
        formattedUsers
      );

      return db.query(userString);
    })
    .then(() => {
      const formattedArticles = articleData.map(
        ({ title, topic, author, body, created_at, votes = 0, article_img_url }) => {
          const formattedTime = convertTimestampToDate({ created_at }).created_at;
          return [title, topic, author, body, formattedTime, votes, article_img_url];
        }
      );

      const articleString = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        formattedArticles
      );

      return db.query(articleString);
    })
    .then(({ rows: insertedArticles }) => {
      const articleLookup = createLookupObj(insertedArticles, "title", "article_id");

      const formattedComments = commentData.map(
        ({ article_title, body, votes = 0, author, created_at }) => {
          const formattedTime = convertTimestampToDate({ created_at }).created_at;
          return [articleLookup[article_title], body, votes, author, formattedTime];
        }
      );

      const commentString = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L;`,
        formattedComments
      );

      return db.query(commentString);
    });
};
module.exports = seed;
