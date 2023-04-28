import express from "express";
import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import build from "./build/index.js";
import getPort from "get-port";
import path from "path";
import readline from "readline";

const app = express();
app.use(express.static("public/build", { immutable: true, maxAge: "365d" }));
app.use(express.static("public", { immutable: true, maxAge: "1h" }));

app.all("*", createRequestHandler({ build }));

let port = await getPort({ port: process.env.PORT || 3000 });

app.listen(port, () => {
  let name = path.basename(new URL(".", import.meta.url).pathname);
  broadcastDevReady(build);
  clearConsole();
  console.log(`Running exercise "${name}"`);
  console.log("");
  console.log(`👉 http://localhost:${port}`);
  console.log("");
});

function clearConsole() {
  console.log("\n".repeat(process.stdout.rows));
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}
