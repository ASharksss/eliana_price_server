const {Category} = require("../models/models");

class CategoryController {

  async createCategory(req, res) {
    try {
      const {name} = req.body
      const category = await Category.create({name})
      return res.json(category)
    } catch (e) {
      return e
    }
  }

}

module.exports = new CategoryController()