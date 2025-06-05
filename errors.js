const handlePostgresErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {
  console.err(err, "<<< error");
  res.status(500).send({ msg: "Something broke!" });
};

module.exports = { handlePostgresErrors, handleCustomErrors, handleServerErrors };
