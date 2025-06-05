const { selectAllUsers } = require("../models/users.models.js");

const getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = { getAllUsers };
