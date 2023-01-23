const requireUser = (req, res, next) => {
  if (!req.user) {
    res.status(401)
    res.send({
      name: 'UnauthorizedUserError',
      message: 'Must be logged in to perform this action'
    })
  }
}

module.exports = {
  requireUser
}