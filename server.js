require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const connectDB = require("./db_connection");
const usersRouter = require("./routers/usersRouter");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

app.use("/api/users", usersRouter);

app.use((req, res) => {
    res.status(404).send("Page wasn't found");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
