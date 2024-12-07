const sql = require("../config/db");

async function createUser(username, password, role) {
    return sql`INSERT INTO users (username, password, role) VALUES (${username}, ${password}, ${role}) RETURNING *;`;
}

async function findUserByUsername(username) {
    return sql`SELECT * FROM users WHERE username = ${username};`;
}

module.exports = { createUser, findUserByUsername };
