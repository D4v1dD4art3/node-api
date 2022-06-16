exports.getPost = (req, res, next) => {
  res.json({
    posts: [
      {
        title: 'First post',
        content: 'This is the first post!',
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(200).json({
    message: 'post create successfully',
    post: { id: new Date().toISOString(), title, content },
  });
};
