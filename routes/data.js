const express = require('express');
const dataModel = require('../model/data');

const router = express.Router();

// Create a new data entry: enables us to save sample data in the DB
router.post('/', async (req, res) => {
  try {
    const data = new dataModel({
      title: req.body.title,
      description: req.body.description,
      amount: req.body.amount,
      resource: req.body.resource,
    });

    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all data entries or filter by amount. The endpoint will look like this: http://localhost:3000/data?amount=100 (This will change based on the user input)
router.get('/', async (req, res) => {
  try {
    const filterByAmount = req.query.amount;
    const query = filterByAmount ? { amount: filterByAmount } : {};
    
    const filteredData = await dataModel.find(query);
    res.status(200).json(filteredData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
