const util = require("util");
const path = require("path");
const fs = require("fs");
const chokidar = require("chokidar");
const minimist = require("minimist");
const io = require("socket.io");
const open = require("open");

const { _newNode, _addToTree, _delFromTree } = require("./src/utils/treeModel");

const miniOpt = {
  default: {
    ignored: ["**/node_modules/**/*", "**/.git/**/*"],
    depth: 99,
  },
};

// const watcher = chokidar.watch('./src', {
//   ignored: argv.ignored,
//   depth: argv.depth,
//   ignorePermissionErrors: true,
//   persistent: true
// });

// watcher.on('change', console.log)

class Main {
  constructor(argv) {
    // check arguments for invalid paths
    this.watchPaths = argv._.map((argPath) => {
      let tmp = path.resolve(argPath);
      if (fs.existsSync(tmp) && fs.lstatSync(tmp).isDirectory()) return tmp;
      throw new Error(`Bad Path or Path is not a Dir: ${tmp}`);
    });
    this.argv = argv;
    this.treeRoot = _newNode({ id: "/root", dir: true });
    this.io = null;
    this.watcher = null;
    this.autoIncr = 0;
  }

  async run() {
    await this.registerFSWatch();
    await this.registerIO();

    open("./build/index.html");

    console.log(
      util.inspect(this.treeRoot.model, false, null, true /* enable colors */)
    );
    console.log("Ready!");
  }

  registerIO = async (port = 3030) => {
    this.io = io(port, {
      cors: {
        origin: true,
      },
    });
    this.io.on("connection", (socket) => {
      socket.emit("init", {
        tree: this.treeRoot.model,
        watchPaths: this.watchPaths,
      });
    });
  };

  addToTree = (path, stat) => {
    _addToTree(this.treeRoot, path, stat.isDirectory());
  };

  delFromTree = (path) => {
    _delFromTree(this.treeRoot, path);
  };

  emitAdd = (path, stat) => {
    return this.io.emit("update:add", { path, dir: stat.isDirectory() });
  };

  emitDel = (path) => {
    return this.io.emit("update:del", { path });
  };

  registerFSWatch = async () => {
    return new Promise((resolve) => {
      this.watcher = chokidar.watch(this.watchPaths, {
        ignored: this.argv.ignored,
        depth: this.argv.depth,
        ignorePermissionErrors: true,
        persistent: true,
      });

      this.watcher.on("addDir", this.addToTree);
      this.watcher.on("add", this.addToTree);
      this.watcher.on("unlink", this.delFromTree);
      this.watcher.on("unlinkDir", this.delFromTree);

      // called when finished init glob scan is finished
      this.watcher.on("ready", resolve);
    }).then(() => {
      // stack listeners to keep server version up to date
      // and emit to client(s) for update.
      this.watcher.on("addDir", this.emitAdd);
      this.watcher.on("add", this.emitAdd);
      this.watcher.on("unlink", this.emitDel);
      this.watcher.on("unlinkDir", this.emitDel);
    });
  };
}

const main = new Main(minimist(process.argv.slice(2), miniOpt));
main.run();
