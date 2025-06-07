const invModel = require("../models/inventory-model")
const Util = {}
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
    console.log(data.rows)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


  Util.buildDetailView = async function(vehicle) {
    const priceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price)
    const milesFormatted = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
  
    let detail = `
      <div class="vehicle-detail">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
        <div class="vehicle-info">
          <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <h3>${priceFormatted}</h3>
          <p><strong>Description:</strong> ${vehicle.inv_description}</p>
          <p><strong>Color:</strong> ${vehicle.inv_color}</p>
          <p><strong>Miles:</strong> ${milesFormatted}</p>
        </div>
      </div>
    `
    return detail
  }
  

  Util.buildDetailView = async function(vehicle){
    let view = '<section id="vehicle-detail">'
    view += `<h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>`
    view += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />`
    view += `<p>${vehicle.inv_description}</p>`
    view += `<ul>`
    view += `<li><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</li>`
    view += `<li><strong>Color:</strong> ${vehicle.inv_color}</li>`
    view += `<li><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</li>`
    view += `</ul>`
    view += '</section>'
    return view
  }
  
  Util.buildClassificationList = async function (selectedId = null) {
    const data = await invModel.getClassifications()
    let list = '<select name="classification_id" id="classification_id" required>'
    list += "<option value=''>Choose a classification</option>"
  
    data.rows.forEach(row => {
      list += `<option value="${row.classification_id}"${selectedId == row.classification_id ? " selected" : ""}>${row.classification_name}</option>`
    })
  
    list += "</select>"
    return list
  }

  module.exports = Util