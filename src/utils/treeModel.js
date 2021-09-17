const TreeModel = require("tree-model");

const tree = new TreeModel();

const newNode = (nodeObj) => {
  return tree.parse(nodeObj);
};

const addToTree = (rootTree, path, dir = false) => {
  const nodeIdPath = path.split("/");
  nodeIdPath.shift();

  let node = rootTree;
  nodeIdPath.forEach((id, idx) => {
    let isDir = dir;
    let tmpNode = node.first((node) => node.model.id == id);
    if (!tmpNode) {
      if (idx != nodeIdPath.length - 1) isDir = true;
      tmpNode = newNode({
        id,
        dir: isDir,
      });
      node.addChild(tmpNode);
    }
    node = tmpNode;
  });
};

const delFromTree = (rootTree, path) => {
  const nodeIdPath = path.split("/");
  nodeIdPath.shift();

  let node = rootTree;
  nodeIdPath.forEach((id) => {
    if (node) node = node.first((node) => node.model.id == id);
  });
  if (node) node.drop();
};

exports._newNode = newNode;
exports._addToTree = addToTree;
exports._delFromTree = delFromTree;
