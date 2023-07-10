const express = require('express');
const dataModel = require('./../model/data');

const router = express.Router();

// CRUD Operations
router.post('/', async function (req, res) {
    const data = new dataModel({
        type: req.body.type,
        resource: req.body.resource,
        amount: req.body.amount,
        description: req.body.description,
    
    });
    console.log(data)

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;