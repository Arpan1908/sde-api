const sql = require("../config/db");

async function createTrain(trainName, source, destination, totalSeats) {
    return sql`INSERT INTO trains (train_name, source, destination, total_seats, available_seats) VALUES (${trainName}, ${source}, ${destination}, ${totalSeats}, ${totalSeats}) RETURNING *;`;
}

async function getTrainsBetweenStations(source, destination) {
    return sql`SELECT * FROM trains WHERE source = ${source} AND destination = ${destination};`;
}



module.exports = { createTrain, getTrainsBetweenStations };
