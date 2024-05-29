const jwt = require('jsonwebtoken')

module.exports.isAuthorized  = function(req, res, next) {
  const authHeader = req.header("Authorization")
  if (!authHeader) {
    return res.status(401).json({message: 'Пользрватель не авторизован, отсутствует токен'})
  }
  const [bearer, token] = authHeader.split(" ")
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({message: 'Пользрватель не авторизован, неправильный формат'})
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err) {
      return res.status(403).json({message: 'Ошибка доступа'})
    }
    req.userId = user.user.id
    req.user = user.user
    return next();
  })
}