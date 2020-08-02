const express = require("express");
const cors = require("cors");
const { json, urlencoded } = require("body-parser");

const morgan = require("morgan");
const helmet = require("helmet");
const { socket } = require("./socket");

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(helmet());

app.use(express.static("public"));

app.post("/", (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      const error = new Error("field `message` is required");
      error.status = 400;
      throw error;
    }

    socket().emit("message", { message });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.use((_req, _res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  let message = error.message;

  if (status === 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  }

  res.status(status).json({ error: { message } });
});

module.exports = app;
