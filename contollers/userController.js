const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const {User, TypeUser} = require("../models/models");
const {refreshToken, generateTokens, EMAIL_USER, HTML_REGISTRATION, transporter} = require("../utils");

class UserController {
  async createUser(req, res) {
    try {
      const {short_name, inn, address, phone, email, password, typeUser} = req.body
      const hashPassword = await bcrypt.hash(password, 10)
      const user = await User.create({short_name, INN: inn, address, telephone: phone, email, password: hashPassword, typeUserId: typeUser})
      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'Регистация на сайте',
        html: HTML_REGISTRATION(email, phone, short_name)
      };
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
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
      let comparePassword = bcrypt.compareSync(password, user.password)
      if (!comparePassword) {
        return res.status(401).json({message: 'Неверный пароль'})
      }
      const {accessToken, refreshToken} = await generateTokens(user);
      delete user.password
      delete user.updatedAt
      const currentDate = new Date()
      const expiresIn = new Date(new Date().setMonth(currentDate.getMonth() + 1))
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        expires: expiresIn,
        // secure: true,
        sameSite: true
      })
      return res.json({token: accessToken, email: user.email, profile: user});
    } catch (e) {
      return res.status(401).json({message: e.message})
    }
  }

  async logout (req, res) {
    try {
      const {refreshToken} = req.cookies
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        expires: new Date(0),
        // secure: false,
        sameSite: false
      })
      return res.json({message: 'ok'})
    } catch (e) {
      return res.status(401).json({message: e.message})
    }
  }

  async loginToAccessToken(req, res, next) {
    try {
      let currentUser = null
      const cookie = req.cookies
      const authToken = cookie.refreshToken;
      console.log(req.cookies)
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