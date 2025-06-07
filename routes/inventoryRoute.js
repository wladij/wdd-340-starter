// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const { classificationRules, checkClassData, inventoryRules, checkInventoryData } = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to deliver vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// Management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Process classification form
router.post("/add-classification", 
  classificationRules, 
  checkClassData, 
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Process inventory form
router.post("/add-inventory", 
  inventoryRules, 
  checkInventoryData, 
  utilities.handleErrors(invController.addInventory)
)

module.exports = router
