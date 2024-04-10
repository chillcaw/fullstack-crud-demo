const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

// Sqlite Connection Configuration
const knex = require("knex")({
    client: "sqlite3", // or 'better-sqlite3'
    connection: {
        filename: ":memory:",
    },
});

// Allows us to parse request JSON body data automatically
app.use(express.json());
app.use(cors());

// GET /users -> Read all users
app.get("/users", async (req, res) => {
    const users = await knex.select().table("users");
    res.send(users);
});

// GET /users/:id -> Read a single user
app.get("/users/:id", async (req, res) => {
    const users = await knex.select().where("id", req.params.id).table("users");

    console.log(users);

    // User was not found
    if (users.length === 0) {
        res.statusCode = 404;
        res.send({ code: 404 });
        return;
    }

    res.send(users.pop());
});

// POST /users -> Create a new user
app.post("/users", async (req, res) => {
    const body = req.body;

    console.log(req.body);

    // name is invalid
    if (!body.name) {
        res.statusCode = 400;
        res.send("400 Bad Request, `name` need to be a valid string");
        return;
    }

    await knex.insert({ name: body.name }).table("users");

    res.statusCode = 201;
    res.send({ code: 201 });
});

// DELETE /users -> Delete a user
app.delete("/users/:id", async (req, res) => {
    const deleteInfo = await knex
        .where("id", req.params.id)
        .delete()
        .table("users");

    if (deleteInfo === 0) {
        res.statusCode = 404;
        res.send({ code: 404 });
        return;
    }

    console.log(deleteInfo);
    res.send({ code: 200 });
});

async function setup() {
    // Drop the user table if it exists
    await knex.schema.dropTableIfExists("users");

    // Create the users table on server run
    await knex.schema.createTable("users", function (table) {
        table.increments();
        table.string("name");
    });

    const promises = [
        knex.insert({ name: "Calum" }).table("users"),
        knex.insert({ name: "Andrew" }).table("users"),
        knex.insert({ name: "Tarryn" }).table("users"),
        knex.insert({ name: "Ben" }).table("users"),
        knex.insert({ name: "Roisin" }).table("users"),
        knex.insert({ name: "Kieran" }).table("users"),
    ];

    await Promise.all(promises);

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

setup();
