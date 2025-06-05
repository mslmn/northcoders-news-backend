const { selectAllTopics } = require("../models/topics.models.js");

const getAllTopics = (req, res) => {
  selectAllTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

module.exports = { getAllTopics };
