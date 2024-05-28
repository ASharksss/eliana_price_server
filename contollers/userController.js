const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const {User, TypeUser} = require("../models/models");
const {refreshToken, generateTokens} = require("../utils");
const generateJWT = (user) => {
  return jwt.sign(
    {user},
    process.env.SECRET_KEY,
    {expiresIn: '144h'}
  )
}

class UserController {
  async createUser(req, res) {
    try {
      const {short_name, INN, address, telephone, email, password, typeUserId} = req.body
      const user = await User.create({short_name, INN, address, telephone, email, password, typeUserId})
      return res.json(user)
    } catch (e) {
      return e
    }
  }

  async getUser(req, res) {
    try {
      const userId = req.userId
      const user = await User.findByPk(userId)
      return res.json(user)
    } catch (e) {
      return e
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body
      let user = null
      if (email !== undefined) {
        user = await User.findOne({
          include: {
            model: TypeUser,
            attributes: ['name']
          },
          where: {email},
          raw: true
        })
      }
      if (user === null) {
        return res.status(404).json({message: 'Пользователь не найден'})
      }
      // let comparePassword = bcrypt.compareSync(password, user.password)
      // if (!comparePassword) {
      //   return res.status(401).json({message: 'Неверный пароль'})
      // }
      const {accessToken, refreshToken} = await generateTokens(user);
      delete user.password
      delete user.updatedAt
      const currentDate = new Date()
      const expiresIn = new Date(new Date().setMonth(currentDate.getMonth() + 1))
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        domain: 'localhost',
        expires: expiresIn,
        secure: true,
        sameSite: 'none'
      })
      return res.json({token: accessToken, email: user.email, profile: user});
    } catch (e) {
      return res.status(401).json({message: e.message})
    }
  }

  async loginToAccessToken(req, res, next) {
    try {
      let currentUser = null
      const cookie = req.cookies
      const authToken = cookie.refreshToken;
      if (!authToken) {
        return res.status(401).json({message: 'Пользрватель не авторизован, отсутствует токен'})
      }
      jwt.verify(authToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if(err) {
          return res.status(403).json({message: 'Ощибка доступа'})
        }
        currentUser = user
      })
      const {accessToken} = await refreshToken(authToken)
      return res.json({token: accessToken, email: currentUser['user'].email, profile: currentUser['user']})
    } catch (e) {
      return res.status(401).json({message: e.message})
    }
  }

}

module.exports = new UserController()