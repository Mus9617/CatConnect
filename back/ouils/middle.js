const validator= require('validator')

const middleURL = (req, res, next) => {
    const link = req.body.image;
    if (!validator.isURL(link)) {
      return res.status(400).json({ msg: "Please send an url" });
    }
    req.isURL = link;
    next();
  };
  module.exports= {middleURL}