const { createTrain } = require("../models/train");


//function to add train and only admin can do it 
async function addTrain(req, res) {
    const { trainName, source, destination, totalSeats } = req.body;
    try {
        const train = await createTrain(trainName, source, destination, totalSeats);
        res.status(201).json(train);
    } catch (error) {
        res.status(500).json({ message: "Error creating new train", error });
    }
}

module.exports = { addTrain };
