const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invController.buildByInvId = async function (req, res) {
  const invId = req.params.invId
  const data = await invModel.getVehicleById(invId)
  const detail = await utilities.buildDetailView(data)
  const nav = await utilities.getNav()
  const vehicleName = `${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
  })
}

/* ***************************
 *  Inventory Management View
 * ************************** */
invController.buildManagement = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("message")
  })
}

/* ***************************
 *  Show Add Classification Form
 * ************************** */
invController.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: [],
    message: req.flash("message") || [] 
  })
}

/* ***************************
 *  Process Classification Form
 * ************************** */
invController.addClassification = async function (req, res) {
  const nav = await utilities.getNav()
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("message", "Classification added successfully.")
    res.redirect("/inv/")
  } else {
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: "Sorry, the insert failed." }],
      message: req.flash("message") || [] 
    })
  }
}

/* ***************************
 *  Show Add Inventory Form
 * ************************** */
invController.buildAddInventory = async function (req, res) {
  const classificationList = await utilities.buildClassificationList()
  const nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    errors: []
  })
}

/* ***************************
 *  Process Add Inventory Form
 * ************************** */
invController.addInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const data = req.body
  const result = await invModel.addInventory(data)

  if (result) {
    req.flash("message", "New vehicle successfully added.")
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(data.classification_id)
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: [{ msg: "Failed to add vehicle." }],
      message: req.flash("message"),
      ...data
    })
  }
}

module.exports = invController
