const pool = require("../database/")

// Get all classification data
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// Get inventory by classification_id
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error)
  }
}

// Get inventory by ID
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error: " + error)
  }
}

// Get vehicle only (simplified version)
async function getVehicleById(invId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getVehicleById error: " + error)
  }
}

// Add new classification
async function addClassification(name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)"
    const data = await pool.query(sql, [name])
    return data.rowCount
  } catch (error) {
    console.error("Error inserting classification:", error)
    return null
  }
}

// Add new inventory item
async function addInventory(data) {
  try {
    const sql = `INSERT INTO inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`
    const values = [
      data.inv_make, data.inv_model, data.inv_year, data.inv_description,
      data.inv_image, data.inv_thumbnail, data.inv_price, data.inv_miles,
      data.inv_color, data.classification_id
    ]
    const result = await pool.query(sql, values)
    return result.rowCount
  } catch (error) {
    console.error("Error inserting inventory:", error)
    return null
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  getVehicleById,
  addClassification,
  addInventory
}
