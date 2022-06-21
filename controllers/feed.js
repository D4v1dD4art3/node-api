const { validationResult } = require('express-validator');
exports.getPost = (req, res, next) => {
  res.json({
    posts: [
      {
        _id: 1,
        title: 'First post',
        content: 'This is the first post!',
        imageUrl: 'images/duck.jpg',
        creator: {
          name: 'David',
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, _next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed entered data is incorrect',
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  // const imageUrl = req.body.imageUrl;
  res.status(200).json({
    message: 'post create successfully',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'David' },
      createdAt: new Date(),
    },
  });
};
