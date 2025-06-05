const endpointsJson = require("../endpoints.json");

const getEndpoints = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

module.exports = { getEndpoints };
