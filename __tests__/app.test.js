const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");
const request = require("supertest");

require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).not.toBe(0);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of all topics, sorted by date in desceding order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).not.toBe(0);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).not.toBe(0);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");
      });
  });
  test("400: responds with 'bad request' for invalid article_id", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with 'db record not found' for non-existent article", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("db record not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments sorted by  date in desceding order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("400: responds with 'bad request' for invalid article_id", () => {
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the newly created comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "I love this article!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.created_at).toBe("string");
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("I love this article!");
        expect(comment.article_id).toBe(1);
        expect(comment.votes).toBe(0);
      });
  });
  test("400: responds with error when missing username or body fields", () => {
    const badComment = { username: "" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(badComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing required username or body fields");
      });
  });

  test("404: responds with error when article_id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Great article!",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("db record not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with the updated article when given a valid inc_votes", () => {
    const updateVotes = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("article_id", 1);
        expect(typeof article.title).toBe("string");
        expect(typeof article.author).toBe("string");
        expect(typeof article.body).toBe("string");
        expect(typeof article.votes).toBe("number");
      });
  });
  test("400: responds with an error when inc_votes is missing from the post request body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing required field: inc_votes");
      });
  });
  test("400: responds with an error when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "five" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid inc_votes value");
      });
  });
  test("400: responds with error for invalid article_id", () => {
    const updateVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/notAnId")
      .send(updateVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with not found for a non-existent article", () => {
    const updateVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/9999")
      .send(updateVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("db record not found");
      });
  });
});
