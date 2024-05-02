const {Product} = require('../models/models')

class ProductController {

  async createProduct(req, res, next) {
    try {
      const {vendor_code, name, categoryId, price_opt, price_roz, brandId} = req.body
      const product =
        await Product.create({vendor_code, name, categoryId, price_opt, price_roz, brandId})
      return res.json(product)
    } catch (e) {
      return e
    }
  }

  async getAll(req, res) {
    try {
      const {categoryId} = req.query
      const products = await Product.findAll({where: {categoryId}})
      return res.json(products)
    } catch (e) {
      return e
    }
  }

}

module.exports = new ProductController()