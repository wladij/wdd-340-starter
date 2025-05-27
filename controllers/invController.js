const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont


/* ***************************
 *  Build detail view by inventory id
 * ************************** */
invCont.buildDetailView = async function (req, res, next) {
  const invId = req.params.invId
  console.log("Vehicle ID requested:", invId)
  const data = await invModel.getInventoryById(invId)
  console.log("Vehicle data:", data)

  if (!data) {
    return res.status(404).send("Vehicle not found")
  }

  const detail = await utilities.buildDetailView(data)
  let nav = await utilities.getNav()
  const title = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    title,
    nav,
    detail,
  })
}


invCont.buildByInvId = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getVehicleById(invId)
  const detail = await utilities.buildDetailView(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  })
}


