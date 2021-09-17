import { useState, useEffect } from "react";
import io from "socket.io-client";
import Tree from "./components/Tree";
import { _newNode, _addToTree, _delFromTree } from "./utils/treeModel";

import "./App.css";

const App = () => {
  const [rootTree, setRootTree] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`ws://${window.location.hostname}:3030`);
    setSocket(newSocket);
    newSocket.on("init", (data) => {
      setRootTree([_newNode(data.tree)]);
    });
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("update:add", addToTree);
    socket.on("update:del", delFromTree);
    return () => socket.off("update:add");
  }, [rootTree]);

  const addToTree = (data) => {
    _addToTree(rootTree[0], data.path, data.dir);
    setRootTree([rootTree[0]]);
  };
  const delFromTree = (data) => {
    _delFromTree(rootTree[0], data.path);
    setRootTree([rootTree[0]]);
  };

  return (
    <div className="App">
      <hr />
      {rootTree ? <Tree data={rootTree} /> : <h1>Loading</h1>}
    </div>
  );
};

export default App;
