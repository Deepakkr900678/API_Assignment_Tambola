const express = require("express");
const loginRoutes = require("./routes/login")
const userRoutes = require("./routes/user")
const connect = require("./connection/connect")

const app = express();

app.use("", loginRoutes);
app.use("", userRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.get("*", (req, res) => {
    res.send("Hello World");
})

app.listen(3000, () => console.log("The server is up at 3000 port"));