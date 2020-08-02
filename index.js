const dotenv = require("dotenv-safe");

dotenv.config();

console.info(`NODE_ENV is set to ${process.env.NODE_ENV}`);

const { version } = require("./package.json");

console.info(`version ${version}`);

const http = require("http");
const SocketIO = require("socket.io");
const app = require("./app");
const { startSocket } = require("./socket");

const port = process.env.PORT;

const server = http.createServer(app);

const onError = (err) => {
  if (err.syscall !== "listen") {
    throw err;
  }
  switch (err.code) {
    case "EACCES":
      console.error(`Port ${port} requires elevated privileges`);
      break;
    case "EADDRINUSE":
      console.error(`Port ${port} is already in use`);
      break;
    default:
      console.error(err);
  }
  process.exit(1);
};

const onListening = () => {
  const addr = server.address();
  if (addr && typeof addr !== "string") {
    console.log(`Listening on port ${addr.port}`);
  }
};

(async () => {
  startSocket(server);

  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
