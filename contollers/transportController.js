const {Transport_company, Field_name, Transport_company_field, Field_options, Waybills} = require("../models/models");
const {Op} = require("sequelize");

class TransportController {
  async getTransportCompanies(req, res) {
    try {
      const companies = await Transport_company.findAll()
      return res.json(companies)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async getFieldNames(req, res) {
    try {
      const {id} = req.query
      const fields = await Transport_company_field.findAll({where: {transportCompanyId: id}})
      const fieldIds = fields.map(item => item.fieldNameId)
      const fieldNames = await Field_name.findAll({
        where: {
          id: {
            [Op.in]: fieldIds
          }
        },
        include: {model: Field_options}
      })
      return res.json(fieldNames)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }

  async createWaybills(req, res) {
    try {
      const {formData} = req.body
      const formDataArray = Object.values(formData);
      console.log(formDataArray)
      for (let [fieldName, textValue] of Object.entries(formData)) {
        await Waybills.create({
          fieldName: fieldName,
          textValue: textValue,
          orderId: 80,
          transportCompanyId: 1
        })
      }
      return res.json(formData)
    } catch (e) {
      return res.status(500).json({error: e.message})
    }
  }
}

module.exports = new TransportController()