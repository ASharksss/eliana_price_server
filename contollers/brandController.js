const {Brand} = require("../models/models");

class BrandController {
  async createBrand(req, res) {
    try {
      const {name} = req.body
      const brand = await Brand.create({name})
      return res.json(brand)
    } catch (e) {
      return e
    }

  }


}

module.exports = new BrandController()