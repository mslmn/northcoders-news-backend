const { selectAllTopics } = require("../models/topics.models.js");

const getAllTopics = (req, res) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics: topics });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = { getAllTopics };
