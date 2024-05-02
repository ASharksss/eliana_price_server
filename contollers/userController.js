const jwt = require("jsonwebtoken");
const {User} = require("../models/models");
const generateJWT = (id, username, roleId) => {
  return jwt.sign(
    {id, username, roleId},
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

}

module.exports = new UserController()