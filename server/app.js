const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const analyticsRouter = require("./routes/analytics");
const authRouter = require("./routes/auth");

const app = express();

// Enable CORS for frontend
app.use(
    cors({
        origin: true, // Reflect request origin
        credentials: true, // Allow cookies, auth headers, etc.
    })
);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Authentication routes (no prefix)
app.use("/api/auth", authRouter);

// Protected routes
app.use("/api/employer", indexRouter);
app.use("/users", usersRouter);
app.use("/api/employer/analytics", analyticsRouter);

module.exports = app;
