module.exports = (req, res, next) => {
  if (req.header("api-key") === "LongSecurePrivateKey") {
    next();
  } else {
    res.send(500);
  }
};
