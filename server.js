const util = require("util");
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const minimist = require("minimist");
const Io = require("socket.io");
const express = require("express");
const http = require("http");

const { _newNode, _addToTree, _delFromTree } = require("./src/utils/treeModel");

const argv = minimist(process.argv.slice(2), {
  default: {
    ignored: ["**/node_modules/**/*", "**/.git/**/*"],
    depth: 99,
    port: 3000,
  },
});

const watchPaths = argv._.map((argPath) => {
  let tmp = path.resolve(argPath);
  if (fs.existsSync(tmp) && fs.lstatSync(tmp).isDirectory()) return tmp;
  throw new Error(`Bad Path or Path is not a Dir: ${tmp}`);
});

let treeRoot = _newNode({ id: "/root", dir: true });

// init app
const app = express();

// init http server
const httpServer = http.createServer(app);

// init socket IO
const io = Io(httpServer);

io.on("connection", (socket) => {
  socket.emit("init", {
    tree: treeRoot.model,
  });
});

const addFileToTree = (path) => {
  _addToTree(treeRoot, path, false);
};

const addFolderToTree = (path) => {
  _addToTree(treeRoot, path, true);
};

const delFromTree = (path) => {
  _delFromTree(treeRoot, path);
};

const emitFileAdd = (path) => {
  io.emit("update:add", { path, dir: false });
};
const emitFolderAdd = (path) => {
  io.emit("update:add", { path, dir: true });
};

const emitDel = (path) => {
  io.emit("update:del", { path });
};

const watcher = chokidar.watch(watchPaths, {
  ignored: argv.ignored,
  depth: argv.depth,
  ignorePermissionErrors: true,
  persistent: true,
});

watcher.on("addDir", addFolderToTree);
watcher.on("add", addFileToTree);
watcher.on("unlink", delFromTree);
watcher.on("unlinkDir", delFromTree);

// called when finished init glob scan is finished
watcher.on("ready", () => {
  // log initial tree
  console.log(
    util.inspect(treeRoot.model, false, null, true /* enable colors */)
  );
  watcher.on("addDir", emitFolderAdd);
  watcher.on("add", emitFileAdd);
  watcher.on("unlink", emitDel);
  watcher.on("unlinkDir", emitDel);
});

app.use(express.static(path.resolve(__dirname, "./build/")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./build/index.html"));
});

httpServer.listen(argv.port, () => {
  console.log("Ready on PORT: ", argv.port);
});
