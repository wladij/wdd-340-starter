const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 *  Login Validation
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    })
    return
  }
  next()
}

/* **********************************
 *  Classification Validation
 * ********************************* */
validate.classificationRules = [
  body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .isAlphanumeric()
    .withMessage("Classification name must be alphanumeric with no spaces.")
]

validate.checkClassData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
    })
    return
  }
  next()
}

/* **********************************
 *  Inventory Validation
 * ********************************* */
validate.inventoryRules = [
  body("inv_make").trim().notEmpty().withMessage("Make is required."),
  body("inv_model").trim().notEmpty().withMessage("Model is required."),
  body("inv_year").isNumeric().withMessage("Year must be a number."),
  body("inv_description").trim().notEmpty().withMessage("Description is required."),
  body("inv_price").isFloat().withMessage("Price must be a number."),
  body("inv_miles").isInt().withMessage("Miles must be an integer."),
  body("inv_color").trim().notEmpty().withMessage("Color is required.")
]

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      classificationList,
      errors: errors.array(),
      ...req.body
    })
    return
  }
  next()
}

// ✅ Export everything de una sola vez
module.exports = validate
