const {User} = require("./models/models");

const jwt = require('jsonwebtoken')

const generateTokens = async (user) => {
  try {
    const accessToken = jwt.sign(
      {user},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      {user},
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );
    return { accessToken, refreshToken }
  } catch (err) {
    return Promise.reject(err);
  }
};

const refreshToken = async (oldToken) => {
  try {
    const decodeToken = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findByPk(decodeToken.user.id)
    if (!user) {
      throw Error('Пользователь не найден')
    }
    const { accessToken, refreshToken } = await generateTokens(user)
    return { accessToken, refreshToken };
  } catch (e) {
    throw Error('Неправильный токен')
  }
}

module.exports = {
  generateTokens, refreshToken
}